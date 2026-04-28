'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useCallback, useRef } from 'react'
import { PenSquare, Menu, X, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { debounce } from '@/lib/utils'
import FloatButton from '@/components/home/floatButton'
import AIChatCard from '@/components/home/aiChatCard'
import Footer from '@/components/home/footer'
import styles from './layout.module.less'

const navLinks = [
  { route: '/', label: '首页', key: 'home' },
  { route: '/archive', label: '归档', key: 'archive' },
  { route: '/login', label: '登录', key: 'login' },
]

/**
 * (home) 路由组公共布局
 * 主题策略：固定亮色，不支持切换
 * - layout.module.less 的 .homeRoot 声明硬编码亮色 CSS 变量
 * - 这些变量覆盖 globals.css 的 dark 模式，html.dark class 对 home 完全无效
 *
 * 功能：
 * - 滚动感知导航栏（透明 → 毛玻璃，带入场动画）
 * - 整屏滚动交互（顶部区域触发）
 * - 浮动操作按钮组（回到顶部）
 * - 响应式移动端菜单
 */
export default function HomeGroupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showBackTop, setShowBackTop] = useState(false)
  const [visible, setVisible] = useState(false)

  // 记录整屏滚动是否进行中
  const isScrolling = useRef(false)
  const currentScreen = useRef(0)

  // ── 挂载时隐藏滚动条，卸载时恢复 ─────────────────────────
  useEffect(() => {
    document.documentElement.classList.add('hide-scrollbar')
    return () => {
      document.documentElement.classList.remove('hide-scrollbar')
    }
  }, [])

  const openBiliBili = () => {
    window.open('https://space.bilibili.com/39473070', '_blank')
  }

  // ── 滚动监听 ──────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    setIsScrolled(scrollTop > 50)
    setShowBackTop(scrollTop > 300)
    const windowHeight = window.innerHeight
    currentScreen.current = Math.round(scrollTop / windowHeight)
  }, [])

  useEffect(() => {
    const debouncedScroll = debounce(handleScroll, 16) // ~60fps
    window.addEventListener('scroll', debouncedScroll, { passive: true })
    return () => window.removeEventListener('scroll', debouncedScroll)
  }, [handleScroll])

  // ── 整屏滚动（仅在顶部区域生效）──────────────────────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const direction = e.deltaY > 0 ? 1 : -1

      // 位于最顶部向下滚 → 滚到第一屏底部
      if (scrollTop < 50 && direction === 1) {
        if (isScrolling.current) { e.preventDefault(); return }
        e.preventDefault()
        isScrolling.current = true
        window.scrollTo({ top: windowHeight, behavior: 'smooth' })
        setTimeout(() => { isScrolling.current = false }, 800)
        return
      }

      // 距离顶部恰好一屏高度时向上滚 → 回到顶部
      if (Math.abs(scrollTop - windowHeight) < 50 && direction === -1) {
        if (isScrolling.current) { e.preventDefault(); return }
        e.preventDefault()
        isScrolling.current = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => { isScrolling.current = false }, 800)
        return
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])



  // ── 回到顶部 ───────────────────────────────────────────────
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    // .homeRoot 固定亮色 CSS 变量，完全覆盖 globals.css 的 dark 模式值
    // .layout 负责具体样式，继承 .homeRoot 的变量
    <div className={cn(styles.homeRoot, styles.layout)}>
      {/* ── 导航栏 ── */}
      <nav className={cn(styles.navs, isScrolled ? styles.scrolled : styles.top)}>
        {isScrolled && (
          /* 滚动后展开完整导航 */
          <div className={styles.navContent}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <PenSquare className={styles.logoIcon} />
              <span className={styles.logoText}>Personal Blog</span>
            </Link>

            {/* 桌面端链接 */}
            <ul className={styles.navList}>
              {navLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.route}
                    className={cn(
                      styles.navLink,
                      pathname === item.route && styles.navLinkActive
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* 移动端汉堡按钮 */}
            <button
              className={cn(styles.iconBtn, styles.hamburger)}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="菜单"
            >
              {menuOpen
                ? <X className={styles.iconBtnSvg} />
                : <Menu className={styles.iconBtnSvg} />
              }
            </button>
          </div>
        )}

        {/* 移动端展开菜单 */}
        {menuOpen && isScrolled && (
          <div className={styles.mobileMenu}>
            {navLinks.map((item) => (
              <Link
                key={item.key}
                href={item.route}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  styles.mobileLink,
                  pathname === item.route && styles.mobileLinkActive
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── 页面内容 ── */}
      <main>{children}</main>

      {/* ── 页脚 ── */}
      <Footer />

      {/* ── 浮动操作按钮组 ── */}
      <div className={styles.floatButtonContainer}>
        <FloatButton downIconClick={scrollToTop} upIconClick={openBiliBili} leftIconClick={() => {
          setVisible(pre => !pre)
        }} showBackTop={showBackTop} />
      </div>

      <AIChatCard visible={visible} setVisible={setVisible} />
    </div>
  )
}
