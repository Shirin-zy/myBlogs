"use client"

import React from "react"
import { Calendar, RefreshCw, FileText, Clock, Eye, MapPin, MessageSquare, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Footer from "@/components/home/footer"
import "@wangeditor/editor/dist/css/style.css"
import styles from "./page.module.less"

const ArticleDetailPage = () => {
  const router = useRouter()
  // 模拟文章数据
  const articleData = {
    title: "科学上网完整教程",
    publishDate: "2023-11-07",
    updateDate: "2025-11-26",
    tags: ["#精选", "#热门", "#网络代理", "#代理软件"],
    stats: {
      wordCount: 940,
      readingTime: "2分钟",
      views: 218,
      location: "日本 东京",
      comments: 0,
    },
    content:
      '<h1><span style="color: rgb(196, 29, 127); font-size: 40px;"><strong>科学上网</strong></span></h1><ul><li>什么是科学上网</li><li>如何进行科学上网</li></ul><p style="text-align: center;"><img src="https://img.shetu66.com/2023/07/04/1688453332868636.png" alt="12" data-href="https://img.shetu66.com/2023/07/04/1688453332868636.png" style="width: 486.00px;height: 272.42px;"></p>',
  }
  return (
    <div className={styles.detailPage}>
      {/* 顶部文章信息区域 */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()} title="返回上次页面">
          <ArrowLeft size={20} />
          <span>返回</span>
        </button>

        <div className={styles.headerContent}>
          <div className={styles.tags}>
            <span className={`${styles.tag} ${styles.original}`}>原创</span>
            <span className={`${styles.tag} ${styles.tutorial}`}>教程</span>
            {articleData.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>

          <h1 className={styles.title}>{articleData.title}</h1>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Calendar /> 发表于 {articleData.publishDate}
            </div>
            <div className={styles.metaItem}>
              <RefreshCw /> 更新于 {articleData.updateDate}
            </div>
            <div className={styles.metaItem}>
              <FileText /> 字数总计: {articleData.stats.wordCount}
            </div>
            <div className={styles.metaItem}>
              <Clock /> 阅读时长: {articleData.stats.readingTime}
            </div>
            <div className={styles.metaItem}>
              <Eye /> 阅读量: {articleData.stats.views}
            </div>
            <div className={styles.metaItem}>
              <MapPin /> {articleData.stats.location}
            </div>
            <div className={styles.metaItem}>
              <MessageSquare /> 评论数: {articleData.stats.comments}
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
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#f4f7f9" />
          </g>
        </svg>
      </header>

      {/* 文章正文容器 */}
      <main className={styles.contentSection}>
        <div className={styles.contentCard}>
          <div
            className={`${styles.articleBody} w-e-text-container`}
            dangerouslySetInnerHTML={{ __html: articleData.content }}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ArticleDetailPage
