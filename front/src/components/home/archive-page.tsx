import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'

/** 模拟归档数据（按年月分组） */
const archiveData = [
  {
    year: 2026,
    months: [
      {
        month: '4 月',
        posts: [
          { slug: 'nextjs-15-new-features', title: 'Next.js 15 新特性全解析', date: '2026-04-15' },
          { slug: 'typescript-advanced-types', title: 'TypeScript 5 高级类型技巧', date: '2026-04-10' },
          { slug: 'tailwind-css-layout', title: '用 Tailwind CSS 构建响应式布局', date: '2026-04-05' },
        ],
      },
      {
        month: '3 月',
        posts: [
          { slug: 'react-server-components', title: 'React Server Components 深度解析', date: '2026-03-22' },
          { slug: 'zustand-best-practices', title: 'Zustand 状态管理最佳实践', date: '2026-03-14' },
        ],
      },
    ],
  },
  {
    year: 2025,
    months: [
      {
        month: '12 月',
        posts: [
          { slug: 'vite-build-optimization', title: 'Vite 构建优化实战', date: '2025-12-28' },
          { slug: 'monorepo-with-turborepo', title: 'Monorepo 与 Turborepo 实践指南', date: '2025-12-10' },
        ],
      },
    ],
  },
]

/**
 * 归档页组件
 * 按年份/月份时间轴展示所有文章
 */
export function ArchivePage() {
  const totalPosts = archiveData.flatMap((y) => y.months).flatMap((m) => m.posts).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* 页头 */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">文章归档</h1>
        <p className="text-muted-foreground mt-2">
          共 <span className="font-semibold text-foreground">{totalPosts}</span> 篇文章，按时间轴排列
        </p>
      </div>

      {/* 时间轴 */}
      <div className="space-y-10">
        {archiveData.map((yearGroup) => (
          <div key={yearGroup.year}>
            {/* 年份标题 */}
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {String(yearGroup.year).slice(2)}
              </span>
              {yearGroup.year} 年
            </h2>

            {/* 月份列表 */}
            <div className="space-y-6 pl-5 border-l-2 border-border">
              {yearGroup.months.map((monthGroup) => (
                <div key={monthGroup.month}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 -ml-5 pl-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                    {monthGroup.month}
                  </h3>

                  <ul className="space-y-2">
                    {monthGroup.posts.map((post) => (
                      <li key={post.slug} className="group flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/posts/${post.slug}`}
                            className="text-sm text-foreground group-hover:text-primary transition-colors font-medium inline-flex items-center gap-1"
                          >
                            {post.title}
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">{post.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
