'use client'

import { HardDrive, FolderOpen, Upload, ArrowUpRight, Database, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatFileSize, formatDate } from '@/lib/utils'

/** 模拟概览数据（后续替换为真实 API） */
const overviewStats = [
  {
    title: 'Bucket 总数',
    value: '12',
    description: '存储桶',
    icon: HardDrive,
    trend: '+2 本月新增',
  },
  {
    title: '文件总数',
    value: '45,231',
    description: '个文件',
    icon: FolderOpen,
    trend: '+1,234 本周',
  },
  {
    title: '存储总量',
    value: formatFileSize(128 * 1024 * 1024 * 1024),
    description: '已使用',
    icon: Database,
    trend: '+8.2 GB 本周',
  },
  {
    title: '今日流量',
    value: formatFileSize(2.4 * 1024 * 1024 * 1024),
    description: '下行流量',
    icon: Activity,
    trend: '较昨日 +12%',
  },
]

/** 模拟最近操作记录（使用固定时间戳避免 hydration mismatch） */
const recentActivities = [
  { action: '上传文件', target: 'product-images/banner.png', time: new Date('2026-04-19T10:43:00'), user: 'admin' },
  { action: '创建 Bucket', target: 'my-new-bucket', time: new Date('2026-04-19T10:18:00'), user: 'admin' },
  { action: '删除文件', target: 'temp/old-data.zip', time: new Date('2026-04-19T08:48:00'), user: 'operator' },
  { action: '修改权限', target: 'public-assets', time: new Date('2026-04-19T05:48:00'), user: 'admin' },
  { action: '批量下载', target: '32 个文件', time: new Date('2026-04-18T18:48:00'), user: 'viewer' },
]

/**
 * 控制台首页概览组件
 */
export function DashboardOverview() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">控制台</h1>
        <p className="text-muted-foreground text-sm mt-1">欢迎回来，这是您的 OSS 存储概览</p>
      </div>

      {/* 数据统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {overviewStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 快捷操作 */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">快捷操作</h2>
        <div className="flex flex-wrap gap-3">
          <Button size="sm" className="gap-2">
            <HardDrive className="h-4 w-4" />
            新建 Bucket
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            上传文件
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <ArrowUpRight className="h-4 w-4" />
            权限配置
          </Button>
        </div>
      </div>

      {/* 最近操作记录 */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">最近操作</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Activity className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.target}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(activity.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
