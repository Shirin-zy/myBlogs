"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { PenSquare, Menu, X, User } from "lucide-react";
import { useAppStore } from "@/hooks/store/app-store";
import { cn } from "@/lib/utils";
import { debounce } from "@/lib/utils";
import FloatButton from "@/components/home/floatButton";
import AIChatCard from "@/components/home/aiChatCard";
import Footer from "@/components/home/footer";
import styles from "./layout.module.less";

const baseLinks = [
  { route: "/", label: "首页", key: "home" },
  { route: "/archive", label: "归档", key: "archive" },
  { route: "/toolset", label: "资源库", key: "toolset" },
];

/**
 * (content) 路由组公共布局
 * 适用于非首页的内容页面，如文章详情、标签页等。
 * 移除了 (home) 布局中的整屏滚动逻辑。
 */
export default function ContentGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const isLogin = useAppStore((state) => state.isLogin);
  const { role } = user || {};
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [visible, setVisible] = useState(false);

  const navLinks = useMemo(() => {
    const links = [...baseLinks];
    if (isLogin && role === "admin") {
      links.push({ route: "/dashboard", label: "管理后台", key: "back" });
    }
    if (!isLogin) {
      links.push({ route: "/login", label: "登录", key: "login" });
    }
    return links;
  }, [role, isLogin]);

  // ── 滚动监听 ──────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    // 在内容页中，导航栏通常默认显示或更早进入滚动状态
    setIsScrolled(scrollTop > 50);
    setShowBackTop(scrollTop > 300);
  }, []);

  useEffect(() => {
    const debouncedScroll = debounce(handleScroll, 16);
    window.addEventListener("scroll", debouncedScroll, { passive: true });
    // 初始化执行一次
    handleScroll();
    return () => window.removeEventListener("scroll", debouncedScroll);
  }, [handleScroll]);

  const openBiliBili = () => {
    window.open("https://space.bilibili.com/39473070", "_blank");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={cn(styles.homeRoot, styles.layout)}>
      {/* ── 导航栏 ── */}
      {/* 内容页导航栏通常直接显示 scrolled 状态，或者至少不是完全隐藏 */}
      <nav
        className={cn(
          styles.navs,
          isScrolled ? styles.scrolled : styles.scrolled,
        )}
      >
        <div className={styles.navContent}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <PenSquare className={styles.logoIcon} />
            <span className={styles.logoText}>Personal Blog</span>
          </Link>

          {/* 右侧区域：包含导航标签和操作按钮 */}
          <div className={styles.navRight}>
            {/* 桌面端链接 */}
            <ul className={styles.navList}>
              {navLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.route}
                    className={cn(
                      styles.navLink,
                      pathname === item.route && styles.navLinkActive,
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* 头像 */}
            <div
              className={styles.avatarContainer}
              onClick={() => router.push("/userInfo")}
              suppressHydrationWarning
            >
              {user ? (
                <img
                  src={
                    user?.avatar ||
                    "http://47.108.73.254/images/a3c96fc6-3e1d-4a47-9dbb-ee2ba3ddc4fc.jpg"
                  }
                  alt={user.nickname}
                  className={styles.avatar}
                />
              ) : (
                <User className={styles.avatarIcon} />
              )}
            </div>

            {/* 移动端汉堡按钮 */}
            <button
              className={cn(styles.iconBtn, styles.hamburger)}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="菜单"
            >
              {menuOpen ? (
                <X className={styles.iconBtnSvg} />
              ) : (
                <Menu className={styles.iconBtnSvg} />
              )}
            </button>
          </div>
        </div>

        {/* 移动端展开菜单 */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            {navLinks.map((item) => (
              <Link
                key={item.key}
                href={item.route}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  styles.mobileLink,
                  pathname === item.route && styles.mobileLinkActive,
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── 页面内容 ── */}
      <main className={styles.mainContent}>{children}</main>

      {/* ── 页脚 ── */}
      <Footer />

      {/* ── 浮动操作按钮组 ── */}
      <div className={styles.floatButtonContainer}>
        <FloatButton
          downIconClick={scrollToTop}
          upIconClick={openBiliBili}
          leftIconClick={() => setVisible((pre) => !pre)}
          showBackTop={showBackTop}
        />
      </div>

      <AIChatCard visible={visible} setVisible={setVisible} />
    </div>
  );
}
