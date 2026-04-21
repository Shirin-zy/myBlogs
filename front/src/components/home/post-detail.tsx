import Link from 'next/link'
import { Calendar, Clock, Tag, ArrowLeft, User } from 'lucide-react'

interface PostDetailProps {
  slug: string
}

/** 根据 slug 模拟获取文章内容 */
function getMockPost(slug: string) {
  return {
    slug,
    title: slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    category: '前端开发',
    tags: ['Next.js', 'React', 'TypeScript'],
    date: '2026-04-15',
    readingTime: '8 分钟',
    author: '博主',
    content: `## 前言

这是文章 **${slug}** 的占位内容。后续将接入真实的 Markdown 渲染引擎（如 MDX / ByteMD）。

## 正文示例

\`\`\`typescript
// Hello TypeScript
const greeting = (name: string): string => \`Hello, \${name}!\`
console.log(greeting('World'))
\`\`\`

## 总结

更多内容即将呈现，敬请期待 🚀
    `,
  }
}

/**
 * 文章详情页内容组件
 * Markdown 正文渲染区 + 评论区（占位）
 */
export function PostDetail({ slug }: PostDetailProps) {
  const post = getMockPost(slug)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* ── 正文区域 ── */}
        <article className="flex-1 min-w-0">
          {/* 返回 */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回首页
          </Link>

          {/* 分类 */}
          <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-4">
            {post.category}
          </span>

          {/* 标题 */}
          <h1 className="text-3xl font-bold text-foreground leading-tight mb-4">{post.title}</h1>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>

          {/* 正文（Markdown 占位，后续接入 MDX） */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">
              {post.content}
            </pre>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* 评论区占位 */}
          <section className="mt-12">
            <h2 className="text-xl font-bold text-foreground mb-6">评论</h2>
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              评论系统即将上线，敬请期待 💬
            </div>
          </section>
        </article>

        {/* ── 目录导航 (TOC) 占位 ── */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-20">
            <h3 className="text-sm font-semibold text-foreground mb-3">目录</h3>
            <nav className="space-y-1.5 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-foreground transition-colors">前言</a>
              <a href="#" className="block pl-3 hover:text-foreground transition-colors">正文示例</a>
              <a href="#" className="block hover:text-foreground transition-colors">总结</a>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  )
}
