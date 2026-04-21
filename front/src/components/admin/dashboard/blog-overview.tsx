'use client'

import { FileText, MessageSquare, Tag, TrendingUp, Eye, Users } from 'lucide-react'

/** 模拟核心指标数据 */
const stats = [
  {
    label: '文章总数',
    value: '42',
    change: '+3 本月',
    icon: FileText,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    label: '评论总数',
    value: '186',
    change: '+12 本周',
    icon: MessageSquare,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    label: '分类总数',
    value: '8',
    change: '共 24 个标签',
    icon: Tag,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    label: '今日访问 (PV)',
    value: '1,024',
    change: '+18% 较昨日',
    icon: Eye,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    label: '今日独立访客 (UV)',
    value: '376',
    change: '+9% 较昨日',
    icon: Users,
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-950/30',
  },
  {
    label: '待审核评论',
    value: '7',
    change: '需要处理',
    icon: TrendingUp,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
  },
]

/** 模拟近 7 天访问趋势 */
const trendData = [
  { day: '周一', pv: 820, uv: 310 },
  { day: '周二', pv: 960, uv: 345 },
  { day: '周三', pv: 1100, uv: 390 },
  { day: '周四', pv: 890, uv: 320 },
  { day: '周五', pv: 1240, uv: 420 },
  { day: '周六', pv: 780, uv: 280 },
  { day: '今日', pv: 1024, uv: 376 },
]

/** 模拟热门文章 */
const hotPosts = [
  { title: 'Next.js 15 新特性全解析', views: 3280, comments: 24 },
  { title: 'TypeScript 5 高级类型技巧', views: 2940, comments: 18 },
  { title: '用 Tailwind CSS 构建响应式布局', views: 2510, comments: 15 },
  { title: 'React Server Components 深度解析', views: 2230, comments: 31 },
  { title: 'Zustand 状态管理最佳实践', views: 1880, comments: 12 },
]

/**
 * 博客管理后台数据工作台
 * 展示核心指标、访问趋势及热门文章排行
 */
export function BlogOverview() {
  const maxPv = Math.max(...trendData.map((d) => d.pv))

  return (
    <div className="p-6 space-y-6">
      {/* 页头 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">数据工作台</h1>
        <p className="text-muted-foreground mt-1">博客核心指标一览，掌握内容运营全局</p>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4 flex items-start gap-3"
            >
              <div className={`p-2 rounded-lg ${stat.bg} shrink-0`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-0.5">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.change}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 内容区：访问趋势 + 热门文章 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 过去 7 天访问趋势（简易柱状图） */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">过去 7 天访问趋势</h2>
          <div className="flex items-end gap-2 h-36">
            {trendData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                {/* PV 柱 */}
                <div className="w-full flex flex-col items-center gap-0.5">
                  <div
                    className="w-full rounded-t bg-primary/70 transition-all"
                    style={{ height: `${(d.pv / maxPv) * 100}px` }}
                    title={`PV: ${d.pv}`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded bg-primary/70" />
              PV（页面访问量）
            </span>
          </div>
        </div>

        {/* 热门文章排行 */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">热门文章排行</h2>
          <ol className="space-y-3">
            {hotPosts.map((post, idx) => (
              <li key={post.title} className="flex items-start gap-3">
                <span
                  className={`shrink-0 w-5 h-5 rounded text-xs font-bold flex items-center justify-center mt-0.5 ${
                    idx === 0
                      ? 'bg-orange-400 text-white'
                      : idx === 1
                        ? 'bg-slate-400 text-white'
                        : idx === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground line-clamp-2 leading-snug">{post.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {post.views.toLocaleString()} 阅读 · {post.comments} 评论
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
