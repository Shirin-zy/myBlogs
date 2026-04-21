'use client'

import { useEffect, useInsertionEffect } from 'react'
import { usePathname } from 'next/navigation'

/** 非 dashboard 路由 → 强制亮色 class */
const FORCE_LIGHT_REGEX = /^\/(?!dashboard|posts|audit|settings)(\/|$)/

/** 强制 html 元素亮色 class，synchronous（无副作用） */
function enforceLightClass() {
  document.documentElement.classList.remove('dark')
  document.documentElement.classList.add('light')
}

/**
 * 主题作用域守护组件
 * 挂载在根 ThemeProvider 内部，对所有路由生效。
 *
 * 核心原理：
 * Next.js SPA 客户端导航过程中，html class 沿用上一次的状态，
 * next-themes 的初始化脚本不会重新运行。
 * 所以必须在 React 渲染之前就把 class 修正好。
 *
 * 三路机制：
 * 1. useInsertionEffect（主路）：React 18 专用，在 DOM 渲染前同步执行 DOM 写操作，
 *    保证 home 页面拿到的 html.class 永远是 'light'。
 *    pathname 变化时立即触发（React 渲染前就执行），无任何延迟。
 *
 * 2. useEffect 初始化（辅路1）：渲染后再次确认 class 正确，
 *    防止任何竞态漏网（如 next-themes 渲染时覆盖了 class）。
 *
 * 3. MutationObserver（辅路2）：兜底任何时候 next-themes
 *    通过 React 渲染改变了 class 的情况。
 */
export function ThemeScopeGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // ── 主路（useInsertionEffect）：渲染前同步执行，DOM 写操作先于 React 渲染 ──
  // 关键：此 effect 的依赖是 pathname，路由切换 → pathname 变化 →
  // → useInsertionEffect 先于 React 渲染执行 → home 页面拿到的 html.class 已是 light
  useInsertionEffect(() => {
    if (FORCE_LIGHT_REGEX.test(pathname)) {
      enforceLightClass()
    }
  }, [pathname])

  // ── 辅路1（useEffect）：渲染后确认 class 正确 ───────────────────────────
  useEffect(() => {
    if (FORCE_LIGHT_REGEX.test(pathname)) {
      enforceLightClass()
    }
  }, [pathname])

  // ── 辅路2（MutationObserver）：兜底 next-themes React 渲染的 class 变化 ─
  useEffect(() => {
    if (!FORCE_LIGHT_REGEX.test(pathname)) return

    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains('dark')) {
        enforceLightClass()
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [pathname])

  return <>{children}</>
}
