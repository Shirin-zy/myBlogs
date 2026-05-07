import type { Metadata } from "next"
import { PostsTable } from "@/components/dashboard/posts-table"

export const metadata: Metadata = {
  title: "文章管理 - 管理后台",
}

/**
 * 文章管理页面
 * 这是一个服务端组件，用于导出 metadata
 * 实际的 UI 交互逻辑在 PostsTable 客户端组件中
 */
export default function PostsPage() {
  return <PostsTable />
}
