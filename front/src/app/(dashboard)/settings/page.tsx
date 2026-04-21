import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '系统配置 - 管理后台',
}

/**
 * 系统配置页面
 * 配置站点信息、博主个人资料及 SEO 参数
 */
export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">系统配置</h1>
          <p className="text-muted-foreground mt-1">配置站点信息、博主资料及 SEO 参数</p>
        </div>
      </div>
      {/* TODO: SettingsTabs 组件（站点信息 / 个人资料 / SEO） */}
    </div>
  )
}
