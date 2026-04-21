import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '评论审核 - 管理后台',
}

/**
 * 评论管理页面
 * 待审核评论列表，支持快速通过、回复或删除操作
 */
export default function AuditPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">评论审核</h1>
          <p className="text-muted-foreground mt-1">处理待审核评论，防止垃圾广告及不当内容</p>
        </div>
      </div>
      {/* TODO: CommentReviewList 组件 */}
    </div>
  )
}
