'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  PenSquare,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

/** 主导航菜单 */
const navItems = [
  {
    title: '数据工作台',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: '文章管理',
    href: '/posts',
    icon: FileText,
  },
  {
    title: '评论审核',
    href: '/audit',
    icon: MessageSquare,
  },
]

/** 底部操作菜单 */
const bottomNavItems = [
  {
    title: '系统配置',
    href: '/settings',
    icon: Settings,
  },
]

/**
 * 管理后台侧边栏
 */
export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="flex flex-col w-60 h-full border-r shrink-0"
      style={{ background: 'var(--color-sidebar)', borderColor: 'var(--color-sidebar-border)' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 px-4 py-5 border-b"
        style={{ borderColor: 'var(--color-sidebar-border)' }}
      >
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0">
          <PenSquare className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--color-sidebar-foreground)' }}>
            Personal Blog
          </p>
          <p className="text-xs text-muted-foreground">管理后台</p>
        </div>
      </div>

      {/* 主导航 */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* 底部：系统配置 + 前往博客首页 */}
      <div className="px-2 py-3 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.title}
            </Link>
          )
        })}

        {/* 查看博客前台 */}
        <Link
          href="/home"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          查看博客
        </Link>
      </div>
    </aside>
  )
}
