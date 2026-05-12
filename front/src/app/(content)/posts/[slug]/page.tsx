import type { Metadata } from 'next'
import { PostDetail } from '@/components/home/post-detail'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug} - Personal Blog`,
  }
}

/**
 * 文章详情页
 * 渲染 Markdown 正文、目录导航 (TOC)、评论区
 */
export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params
  return <PostDetail slug={slug} />
}
