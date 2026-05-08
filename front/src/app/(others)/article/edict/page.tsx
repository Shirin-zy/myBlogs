"use client"

import React, { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import { useRouter, useSearchParams } from "next/navigation"
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor"
import { http } from "@/lib/http"
import { useToast } from "@/hooks/use-toast"
import { useApi } from "@/hooks/api-context"
import ArticleDescCard from "@/components/dashboard/ArticleDescCard"
import "@wangeditor/editor/dist/css/style.css"
import styles from "./page.module.less"

// 动态导入编辑器组件，禁用 SSR
const Editor = dynamic(() => import("@wangeditor/editor-for-react").then((mod) => mod.Editor), {
  ssr: false,
})
const Toolbar = dynamic(() => import("@wangeditor/editor-for-react").then((mod) => mod.Toolbar), {
  ssr: false,
})

const EdictContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const { toast } = useToast()
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  // 编辑器内容
  const [html, setHtml] = useState("")
  // 文章标题
  const [title, setTitle] = useState("")
  // 文章设置数据
  const [articleSettings, setArticleSettings] = useState({
    bgPicture: "",
    category: "",
    tags: [] as string[],
  })
  // API 上下文
  const api = useApi()

  // 如果有 id，说明是编辑模式，获取文章详情
  useEffect(() => {
    if (id) {
      const fetchDetail = async () => {
        try {
          const detail = await api.article.getArticleDetail(id)
          setTitle(detail.title)
          setHtml(detail.content)
          setArticleSettings({
            bgPicture: detail.bgPicture || "",
            category: detail.category || "",
            tags: detail.tags || [],
          })
        } catch (error) {
          toast({
            variant: "destructive",
            title: "加载失败",
            description: "无法获取文章详情",
          })
        }
      }
      fetchDetail()
    }
  }, [id, api])

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    MENU_CONF: {
      uploadImage: {
        // 后端上传接口地址
        server: "/upload/image",
        // 对应后端接口的字段名
        fieldName: "file",
        // 自定义上传逻辑
        async customUpload(file: File, insertFn: any) {
          const formData = new FormData()
          formData.append("file", file)

          try {
            const response = await http.post<{ url: string; message: string }>("/upload/image", formData)

            const result = await response
            if (result.url) {
              // 插入图片到编辑器：url, alt, href
              insertFn(result.url, file.name, result.url)
            } else {
              toast({
                variant: "destructive",
                title: "上传失败",
                description: result.message || "未知错误",
              })
            }
          } catch (error) {
            console.error("上传出错:", error)
            toast({
              variant: "destructive",
              title: "上传出错",
              description: "请检查网络或后端服务",
            })
          }
        },
      },
    },
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  // 保存逻辑
  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "提示",
        description: "请输入文章标题",
      })
      return
    }
    if (editor?.isEmpty()) {
      toast({
        variant: "destructive",
        title: "提示",
        description: "文章内容不能为空",
      })
      return
    }

    const articleData = {
      id: id || undefined,
      title,
      content: html,
      ...articleSettings,
    }

    try {
      await api.article.saveArticle(articleData)
      toast({
        title: id ? "更新成功" : "发布成功",
        description: id ? "文章已成功更新" : "文章已成功保存",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "保存出错",
        description: "请检查网络服务",
      })
    }
    setTitle("")
    setHtml("")
    setArticleSettings({
      bgPicture: "",
      category: "",
      tags: [],
    })
    router.push("/posts")
  }

  return (
    <div className={styles.editorPage}>
      <div className={styles.header}>
        <input
          type="text"
          className={styles.titleInput}
          placeholder="请输入文档标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className={styles.actions}>
          <span className={styles.saveStatus}>已保存到本地</span>
          <div className={styles.btnGroup}>
            <button className={styles.backBtn} onClick={() => window.history.back()}>
              返回
            </button>
            <button className={styles.saveBtn} onClick={handleSave}>
              {id ? "保存修改" : "保存"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.toolbarWrapper}>
        <div className={styles.toolbarContainer}>
          <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" />
        </div>
      </div>

      <div className={styles.scrollContainer}>
        <div className={styles.editorWrapper}>
          <Editor
            defaultConfig={editorConfig}
            value={html}
            onCreated={setEditor}
            onChange={(editor) => setHtml(editor.getHtml())}
            mode="default"
            style={{ minHeight: "800px" }}
          />
        </div>
        <div className={styles.sideWrapper}>
          <ArticleDescCard
            key={articleSettings.bgPicture + articleSettings.category}
            initialData={articleSettings}
            onDataChange={setArticleSettings}
          />
        </div>
      </div>
    </div>
  )
}

const EdictPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">加载中...</div>}>
      <EdictContent />
    </Suspense>
  )
}

export default EdictPage
