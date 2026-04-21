import type { Metadata } from 'next'
import { BlogOverview } from '@/components/admin/dashboard/blog-overview'

export const metadata: Metadata = {
  title: '数据工作台 - 管理后台',
}

/**
 * 管理后台首页 - 数据工作台
 * 展示博客核心指标：文章数、评论数、分类数及访问趋势
 */
export default function DashboardPage() {
  return <BlogOverview />
}
