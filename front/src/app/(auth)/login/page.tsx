'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedCharacters from "@/components/login/AnimatedCharacters";
import { useAppStoreActions } from "@/hooks/store/app-store";
import styles from "./login.module.less";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function App() {
  const router = useRouter();
  const { login } = useAppStoreActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);
    setErrorMsg("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setEmailError(true);
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setErrorMsg("密码长度不能少于6位");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(cleanEmail, password);
      // 登录成功，跳转后台
      router.replace("/dashboard");
    } catch (err: unknown) {
      setPasswordError(true);
      setErrorMsg(err instanceof Error ? err.message : "邮箱或密码错误");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* ── Left Panel ── */}
      <div className={styles.leftPanel}>
        <div className={styles.logo}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2L15 9H9L12 2Z" />
            <path d="M12 22L9 15H15L12 22Z" />
            <path d="M2 12L9 9V15L2 12Z" />
            <path d="M22 12L15 15V9L22 12Z" />
          </svg>
          <span>Login</span>
        </div>

        <div className={styles.charactersWrapper}>
          <AnimatedCharacters
            isTyping={isTyping}
            isPasswordFocused={isPasswordFocused}
            showPassword={showPassword}
            passwordLength={password.length}
          />
        </div>

        <div className={styles.footerLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          {/* Sparkle Icon */}
          <div className={styles.sparkleIcon}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.5 9H10.5L12 2Z" fill="#1a1a2e" />
              <path d="M12 22L10.5 15H13.5L12 22Z" fill="#1a1a2e" />
              <path d="M2 12L9 10.5V13.5L2 12Z" fill="#1a1a2e" />
              <path d="M22 12L15 13.5V10.5L22 12Z" fill="#1a1a2e" />
            </svg>
          </div>

          {/* Header */}
          <div className={styles.formHeader}>
            <h1>Welcome back!</h1>
            <p>Please enter your details</p>
          </div>

          <form onSubmit={onSubmit}>
            {/* Email */}
            <div className={styles.formGroup}>
              <label
                htmlFor="email"
                className={emailError ? styles.errorLabel : ""}
              >
                邮箱
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (emailError) setEmailError(false);
                    if (errorMsg) setErrorMsg("");
                  }}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  placeholder="you@example.com"
                  autoComplete="off"
                  className={emailError ? styles.error : ""}
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label
                htmlFor="password"
                className={passwordError ? styles.errorLabel : ""}
              >
                密码
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (passwordError) setPasswordError(false);
                    if (errorMsg) setErrorMsg("");
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="********"
                  className={passwordError ? styles.error : ""}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className={styles.formOptions}>
              <label className={styles.rememberMe}>
                <input type="checkbox" defaultChecked /> Remember for 30 days
              </label>
              <a href="#" className={styles.forgotLink}>
                忘记密码？
              </a>
            </div>

            {/* Error Message */}
            {errorMsg ? (
              <div className={styles.errorMsg}>{errorMsg}</div>
            ) : null}

            {/* Login Button */}
            <button type="submit" className={styles.btnLogin} disabled={isSubmitting}>
              <span className={styles.btnText}>
                {isSubmitting ? "登录中..." : "登录"}
              </span>
              <div className={styles.btnHoverContent}>
                <span>{isSubmitting ? "登录中..." : "登录"}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </button>

            {/* Google Button */}
            <button type="button" className={styles.btnGoogle}>
              <span className={styles.btnText}>
                <svg className={styles.googleIcon} viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84v-.14z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Log in with Google
              </span>
              <div className={styles.btnHoverContent}>
                <span>使用Google登录</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </button>
          </form>

          <div className={styles.signupLink}>
            还没有账号？
            <a href="#">注册</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
