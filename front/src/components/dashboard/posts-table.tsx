"use client"

import { Plus, Pencil, Trash2, Eye, Loader2, Send, Ban, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useApi } from "@/hooks/api-context"
import { type ArticleItem } from "@/lib/api/article"
import { useState, useEffect, useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export function PostsTable() {
  const api = useApi()
  const router = useRouter()
  const { toast } = useToast()
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: articles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 73, // 估计行高
    overscan: 10,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()
  const paddingTop = virtualItems.length > 0 ? virtualItems?.[0]?.start || 0 : 0
  const paddingBottom = virtualItems.length > 0 ? totalSize - (virtualItems?.[virtualItems.length - 1]?.end || 0) : 0

  const getAllArticles = async () => {
    try {
      const response = await api.article.getAllArticles()
      setArticles(response.list)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "加载失败",
        description: "无法获取文章列表，请稍后重试",
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      await api.article.deleteArticle(deleteId)
      toast({
        title: "删除成功",
        description: "文章已成功删除",
      })
      await getAllArticles()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "删除失败",
        description: "删除文章时出错，请重试",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleUpdateState = async (id: string, state: "published" | "draft" | "takeoff") => {
    try {
      await api.article.updateArticleState(id, state)
      toast({
        title: "状态更新成功",
        description: `文章状态已更新为 ${state === "published" ? "已发布" : state === "draft" ? "草稿" : "已下架"}`,
      })
      await getAllArticles()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "状态更新失败",
        description: "更新文章状态时出错，请重试",
      })
    }
  }

  useEffect(() => {
    getAllArticles()
  }, [])

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">文章管理</h1>
            <p className="text-muted-foreground mt-1">管理博客文章的创作、编辑与发布状态</p>
          </div>
          <Button className="cursor-pointer" onClick={() => router.push("/article/edict")}>
            <Plus className="mr-2 h-4 w-4" />
            新增文章
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div ref={parentRef} className="h-full overflow-auto bg-card rounded-lg border shadow-sm relative">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card shadow-sm">
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
              {paddingTop > 0 && (
                <TableRow>
                  <TableCell colSpan={6} style={{ height: `${paddingTop}px` }} />
                </TableRow>
              )}
              {virtualItems.map((virtualRow) => {
                const post = articles[virtualRow.index]
                if (!post) return null

                return (
                  <TableRow key={post.id} ref={rowVirtualizer.measureElement} data-index={virtualRow.index}>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          title="预览"
                          onClick={() => {
                            router.push(`/article/${post.id}`)
                          }}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 cursor-pointer" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" title="更多操作" className="cursor-pointer">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" sideOffset={4} className="min-w-[120px]">
                            <DropdownMenuItem
                              disabled={post.state === "published"}
                              className="cursor-pointer flex items-center gap-2 py-2"
                              onClick={() => handleUpdateState(post.id, "published")}
                            >
                              <Send className="h-4 w-4 text-primary" />
                              <span>发布文章</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={post.state === "takeoff"}
                              className="cursor-pointer flex items-center gap-2 py-2"
                              onClick={() => handleUpdateState(post.id, "takeoff")}
                            >
                              <Ban className="h-4 w-4 text-destructive" />
                              <span>下架文章</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer flex items-center gap-2 py-2"
                              onClick={() => {
                                router.push(`/article/edict?id=${post.id}`)
                              }}
                            >
                              <Edit3 className="h-4 w-4 text-muted-foreground" />
                              <span>编辑内容</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive cursor-pointer"
                          title="删除"
                          onClick={() => {
                            setDeleteId(post.id)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {paddingBottom > 0 && (
                <TableRow>
                  <TableCell colSpan={6} style={{ height: `${paddingBottom}px` }} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除文章？</AlertDialogTitle>
            <AlertDialogDescription>此操作无法撤销。这将永久删除该文章及其所有相关数据。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  删除中...
                </>
              ) : (
                "确认删除"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
