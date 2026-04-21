import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '文章管理 - 管理后台',
}

/**
 * 文章管理页面
 * 列出所有文章，支持新建、编辑、删除及发布/草稿切换
 */
export default function PostsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">文章管理</h1>
          <p className="text-muted-foreground mt-1">管理博客文章的创作、编辑与发布状态</p>
        </div>
      </div>
      {/* TODO: PostsTable 组件 */}
    </div>
  )
}
