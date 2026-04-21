import type { Metadata } from 'next'
import { ArchivePage } from '@/components/home/archive-page'

export const metadata: Metadata = {
  title: '归档 - Personal Blog',
  description: '按时间轴浏览所有文章归档。',
}

/**
 * 归档页
 * 按年份/月份对文章进行时间轴排列
 */
export default function Archive() {
  return <ArchivePage />
}
