import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ThemeScopeGuard } from '@/components/providers/theme-scope-guard'
import { AppStoreProvider } from '@/hooks/store/app-store'
import { ApiProvider } from '@/hooks/api-context'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OSS Manager - 对象存储管理系统',
  description: '高效、易用的 OSS 对象存储 Web 端管理界面',
}

/**
 * 主题作用域策略：
 * - 博客前台 / 登录页：强制亮色（内联脚本 + ThemeScopeGuard 双保险）
 * - 管理后台：(dashboard) 路由组拥有完整主题切换能力
 *
 * 实现原理：
 * next-themes ThemeProvider 统一挂在根层，全局管理 theme 状态。
 * 两层保护：
 * 1. <head> 内联脚本 — 在 JS bundle 执行前（SSR / 刷新页面时）运行，
 *    非 dashboard 路由强制写 html class="light"，防止 hydration 闪屏
 * 2. ThemeScopeGuard — 在客户端路由切换后检测 pathname，
 *    强制 setTheme('light') 同步 html class，防止 Next.js SPA 导航后主题残留
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          // 在 hydration 之前执行，阻止浏览器先渲染暗色主题
          dangerouslySetInnerHTML={{
            __html: `
              ;(function() {
                var path = window.location.pathname
                // dashboard 路由走 ThemeProvider 的正常主题逻辑，其他页面强制亮色
                if (!/^\\/(dashboard|posts|audit|settings)/.test(path)) {
                  document.documentElement.classList.add('light')
                  document.documentElement.classList.remove('dark')
                }
              })()
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeScopeGuard>
            <AppStoreProvider>
              <ApiProvider>
                {children}
                <Toaster />
              </ApiProvider>
            </AppStoreProvider>
          </ThemeScopeGuard>
        </ThemeProvider>
      </body>
    </html>
  )
}
