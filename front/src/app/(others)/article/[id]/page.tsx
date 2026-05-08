"use client"

import React, { use, useEffect, useState } from "react"
import { Calendar, RefreshCw, FileText, Clock, Eye, MapPin, MessageSquare, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import "@wangeditor/editor/dist/css/style.css"
import Footer from "@/components/home/footer"
import { useApi } from "@/hooks/api-context"
import { type ArticleItem } from "@/lib/api/article"
import styles from "./page.module.less"

const ArticleDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter()
  const { id } = use(params)
  const [article, setArticle] = useState<(ArticleItem & { content: string }) | undefined>()
  const api = useApi()

  const fetchArticle = async () => {
    const response = await api.article.getArticleDetail(id)
    setArticle(response)
  }

  useEffect(() => {
    fetchArticle()
  }, [id])

  return (
    <div className={styles.detailPage}>
      {/* 顶部文章信息区域 */}
      <header
        className={styles.header}
        style={{
          backgroundImage: article?.bgPicture ? `url(${article.bgPicture})` : undefined,
        }}
      >
        <div className={styles.headerMask}></div>
        <button className={styles.backButton} onClick={() => router.back()} title="返回上次页面">
          <ArrowLeft size={20} />
          <span>返回</span>
        </button>

        <div className={styles.headerContent}>
          <div className={styles.tags}>
            <span className={`${styles.tag} ${styles.original}`}>原创</span>
            <span className={`${styles.tag} ${styles.tutorial}`}>教程</span>
            {article?.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>

          <h1 className={styles.title}>{article?.title}</h1>

          <div className={styles.meta}>
            <div className={styles.metaItem}></div>
            <div className={styles.metaItem}>
              <RefreshCw /> 更新于 {article?.created_at}
            </div>
            <div className={styles.metaItem}>
              <FileText /> 字数总计: {0}
            </div>
            <div className={styles.metaItem}>
              <Clock /> 阅读时长: {"5分钟"}
            </div>
            <div className={styles.metaItem}>
              <Eye /> 阅读量: {0}
            </div>
            <div className={styles.metaItem}>
              <MapPin /> {"未知"}
            </div>
            <div className={styles.metaItem}>
              <MessageSquare /> 评论数: {article?.comment || 0}
            </div>
          </div>
        </div>

        {/* 动态波浪效果 */}
        <svg
          className={styles.waves}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className={styles.parallax}>
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(244,247,249,0.7)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(244,247,249,0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(244,247,249,0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#f4f7f9" />
          </g>
        </svg>
      </header>

      {/* 文章正文容器 */}
      <main className={styles.contentSection}>
        <div className={styles.contentCard}>
          <div
            className={`${styles.articleBody} w-e-text-container`}
            dangerouslySetInnerHTML={{ __html: article?.content || "" }}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ArticleDetailPage
