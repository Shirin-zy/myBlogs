'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor, Bell, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore, useAppStoreActions } from '@/hooks/store/app-store'
import { useRouter } from 'next/navigation'

/**
 * 管理后台顶部导航栏
 * 包含主题切换、通知及用户信息
 */
export function Header() {
  const { theme, setTheme } = useTheme()
  const { logout } = useAppStoreActions()
  const user = useAppStore((state) => state.user)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const themeIcons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  }

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
      <div className="flex items-center gap-2">
        {/* 面包屑 / 页面标题扩展区 */}
      </div>

      <div className="flex items-center gap-2">
        {/* 主题切换 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(nextTheme)}
          title={`当前: ${theme ?? 'system'} 模式`}
          suppressHydrationWarning
        >
          {themeIcons[(theme as keyof typeof themeIcons) ?? 'system']}
        </Button>

        {/* 通知 */}
        <Button variant="ghost" size="icon" title="通知">
          <Bell className="h-4 w-4" />
        </Button>

        {/* 用户信息 */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-none">
              {user ?? '管理员'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user ?? 'admin'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={handleLogout}
            title="退出登录"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
