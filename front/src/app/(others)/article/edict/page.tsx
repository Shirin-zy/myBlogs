"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor"
import { useToast } from "@/hooks/use-toast"
import "@wangeditor/editor/dist/css/style.css"
import styles from "./page.module.less"

// 动态导入编辑器组件，禁用 SSR
const Editor = dynamic(() => import("@wangeditor/editor-for-react").then((mod) => mod.Editor), {
  ssr: false,
})
const Toolbar = dynamic(() => import("@wangeditor/editor-for-react").then((mod) => mod.Toolbar), {
  ssr: false,
})

const EdictPage = () => {
  const { toast } = useToast()
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  // 编辑器内容
  const [html, setHtml] = useState("")
  // 文章标题
  const [title, setTitle] = useState("")

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    MENU_CONF: {
      uploadImage: {
        // 后端上传接口地址
        server: "http://127.0.0.1:5173/api/v1/upload/image",
        // 对应后端接口的字段名
        fieldName: "file",
        // 自定义上传逻辑
        async customUpload(file: File, insertFn: any) {
          const formData = new FormData()
          formData.append("file", file)

          try {
            const response = await fetch("http://127.0.0.1:5173/api/upload/image", {
              method: "POST",
              body: formData,
            })

            const result = await response.json()
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
  const handleSave = () => {
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
      title,
      content: html,
      saveTime: new Date().toLocaleString(),
    }

    console.log("保存文章数据:", articleData)
    toast({
      title: "保存成功",
      description: "文章已保存！请查看控制台。",
    })
    // 这里可以接入后端 API 进行保存
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
              保存
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
      </div>
    </div>
  )
}

export default EdictPage
