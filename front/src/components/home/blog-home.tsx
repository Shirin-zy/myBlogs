import Link from 'next/link'
import { Calendar, Clock, Tag, ArrowRight, User } from 'lucide-react'

/** 模拟文章列表数据 */
const mockPosts = [
  {
    slug: 'nextjs-15-new-features',
    title: 'Next.js 15 新特性全解析',
    excerpt: '深入解读 Next.js 15 带来的全新 App Router 增强、Server Actions 改进及性能优化策略，帮助你快速上手最新版本。',
    category: '前端开发',
    tags: ['Next.js', 'React', 'TypeScript'],
    date: '2026-04-15',
    readingTime: '8 分钟',
    author: '博主',
  },
  {
    slug: 'typescript-advanced-types',
    title: 'TypeScript 5 高级类型技巧',
    excerpt: '全面介绍 TypeScript 5 中的条件类型、映射类型、模板字面量类型等高级特性，提升类型编程能力。',
    category: '前端开发',
    tags: ['TypeScript', '类型系统'],
    date: '2026-04-10',
    readingTime: '12 分钟',
    author: '博主',
  },
  {
    slug: 'tailwind-css-layout',
    title: '用 Tailwind CSS 构建响应式布局',
    excerpt: '从栅格系统到弹性盒模型，全面讲解 Tailwind CSS v4 的布局工具，打造完美适配各端的页面。',
    category: '前端开发',
    tags: ['Tailwind CSS', '响应式'],
    date: '2026-04-05',
    readingTime: '6 分钟',
    author: '博主',
  },
]

/** 模拟热门标签 */
const hotTags = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Node.js', '工程化', '性能优化']

/**
 * 博客前台首页
 * 左侧文章列表 + 右侧侧边栏
 */
export function BlogHome() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* ── 文章列表 ── */}
        <section className="flex-1 min-w-0 space-y-6">
          <h2 className="text-xl font-bold text-foreground">最新文章</h2>

          {mockPosts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
            >
              {/* 分类 */}
              <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-3">
                {post.category}
              </span>

              {/* 标题 */}
              <Link href={`/posts/${post.slug}`}>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </Link>

              {/* 摘要 */}
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>

              {/* 元信息 */}
              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime}
                </span>
              </div>

              {/* 标签 + 阅读更多 */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-0.5 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/posts/${post.slug}`}
                  className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                >
                  阅读全文
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* ── 侧边栏 ── */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          {/* 博主简介 */}
          <div className="rounded-xl border border-border bg-card p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">博主</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              热爱技术，喜欢分享。专注于 Web 前端开发与工程化实践。
            </p>
          </div>

          {/* 热门标签 */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-foreground mb-3">热门标签</h3>
            <div className="flex flex-wrap gap-2">
              {hotTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground bg-muted hover:bg-accent hover:text-foreground px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 快速入口 */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-foreground mb-3">快速入口</h3>
            <div className="space-y-2">
              <Link
                href="/archive"
                className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>文章归档</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
