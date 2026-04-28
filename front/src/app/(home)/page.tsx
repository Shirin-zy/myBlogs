import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: '首页 - Personal Blog',
  description: '一个现代化的个人博客，分享技术与生活。',
}

/**
 * 博客前台首页
 * 展示文章列表、侧边栏（博主简介、热门标签、最新评论）
 */
export default function HomePage() {
  return redirect('/home')
}
