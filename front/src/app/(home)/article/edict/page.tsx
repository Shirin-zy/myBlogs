'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import styles from './page.module.less'

// 动态导入编辑器组件，禁用 SSR
const Editor = dynamic(() => import('@wangeditor/editor-for-react').then(mod => mod.Editor), {
    ssr: false
})
const Toolbar = dynamic(() => import('@wangeditor/editor-for-react').then(mod => mod.Toolbar), {
    ssr: false
})

const EdictPage = () => {
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    // 编辑器内容
    const [html, setHtml] = useState('')
    // 文章标题
    const [title, setTitle] = useState('')

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {}

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: '请输入内容...',
        MENU_CONF: {
            uploadImage: {
                // 小于 5kb 的图片直接使用 base64 格式，减少网络请求
                base64LimitSize: 5 * 1024,
                // 这里可以配置图片上传逻辑
                // server: '/api/upload', // 实际后端上传接口
                // 如果需要自定义上传逻辑，可以使用 customUpload
                async customUpload(file: File, insertFn: any) {
                    // 这里可以实现您自己的上传逻辑（如 OSS、S3 或自己的后端）
                    // 目前演示直接转为 base64 插入
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onload = () => {
                        const url = reader.result as string
                        insertFn(url, file.name, url)
                    }
                }
            }
        }
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
            alert('请输入文章标题')
            return
        }
        if (editor?.isEmpty()) {
            alert('文章内容不能为空')
            return
        }

        const articleData = {
            title,
            content: html,
            saveTime: new Date().toLocaleString()
        }

        console.log('保存文章数据:', articleData)
        alert('文章已保存！请查看控制台。')
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
                            保存发布
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.toolbarWrapper}>
                <div className={styles.toolbarContainer}>
                    <Toolbar
                        editor={editor}
                        defaultConfig={toolbarConfig}
                        mode="default"
                    />
                </div>
            </div>

            <div className={styles.scrollContainer}>
                <div className={styles.editorWrapper}>
                    <Editor
                        defaultConfig={editorConfig}
                        value={html}
                        onCreated={setEditor}
                        onChange={editor => setHtml(editor.getHtml())}
                        mode="default"
                        style={{ minHeight: '800px' }}
                    />
                </div>
            </div>
        </div>
    )
}

export default EdictPage
