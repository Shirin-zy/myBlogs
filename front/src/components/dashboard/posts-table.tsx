"use client"

import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useApi } from "@/hooks/api-context"
import { type ArticleItem } from "@/lib/api/article"
import { useState, useEffect } from "react"

// 模拟数据
const MOCK_POSTS = [
  {
    id: "1",
    title: "深入理解 Next.js 15 App Router",
    status: "published",
    category: "前端技术",
    createdAt: "2024-03-20",
    views: 1240,
  },
  {
    id: "2",
    title: "Tailwind CSS v4 新特性概览",
    status: "draft",
    category: "CSS",
    createdAt: "2024-03-18",
    views: 0,
  },
  {
    id: "3",
    title: "使用 TypeScript 构建高性能后端",
    status: "published",
    category: "后端开发",
    createdAt: "2024-03-15",
    views: 856,
  },
]

export function PostsTable() {
  const api = useApi()
  const router = useRouter()
  const [articles, setArticles] = useState<ArticleItem[]>([])

  const getAllArticles = async () => {
    const response = await api.article.getAllArticles()
    setArticles(response.list)
  }

  useEffect(() => {
    getAllArticles()
  }, [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">文章管理</h1>
          <p className="text-muted-foreground mt-1">管理博客文章的创作、编辑与发布状态</p>
        </div>
        <Button onClick={() => router.push("/article/edict")}>
          <Plus className="mr-2 h-4 w-4" />
          新增文章
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">文章标题</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>发布日期</TableHead>
              <TableHead className="text-right">阅读量</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((post) => (
              <TableRow
                key={post.id}
                onClick={() => {
                  router.push(`/article/detial`)
                }}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  {post.state === "published" && <Badge variant="default">已发布</Badge>}
                  {post.state === "draft" && <Badge variant="secondary">草稿</Badge>}
                  {post.state === "takeoff" && <Badge variant="destructive">下架</Badge>}
                </TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.created_at}</TableCell>
                <TableCell className="text-right">{post.comment}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="预览">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="编辑">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" title="删除">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
