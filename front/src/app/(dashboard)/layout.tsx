import { DashboardLayout } from '@/components/layout/dashboard-layout'

/**
 * 控制台路由组布局
 * - DashboardLayout（侧边栏 + 顶部栏）已在此渲染
 * - 主题切换由根 layout 的 ThemeProvider 统一管理，
 *   内联脚本已确保 dashboard 路由不受"强制亮色"影响
 */
export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
