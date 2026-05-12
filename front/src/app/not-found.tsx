"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Rocket } from "lucide-react"
import styles from "./not-found.module.less"
import { useApi } from "@/hooks/api-context"
import { type ArticleItem as ArticleProps } from "@/lib/api/article"
import ArticleItem from "@/components/home/article/articleItem"
import errorImg from "@/assets/404.jpg"

export default function NotFound() {
  const router = useRouter()
  const { article } = useApi()
  const [recommendedArticles, setRecommendedArticles] = useState<ArticleProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // 获取最新的 3 篇文章作为推荐
        const data = await article.getArticles({ page: 1, limit: 3 })
        setRecommendedArticles(data.list || [])
      } catch (error) {
        console.error("获取推荐文章失败:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [article])

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.card404}>
        <div className={styles.imageSection}>
          <Image src={errorImg} alt="404 Error" width={300} height={300} priority />
        </div>
        <div className={styles.textSection}>
          <h1>404</h1>
          <p>请尝试站内搜索寻找文章</p>
          <button className={styles.homeButton} onClick={() => router.push("/")}>
            <Rocket className={styles.icon} />
            回到主页
          </button>
        </div>
      </div>

      <div className={styles.recommendSection}>
        <h2 className={styles.sectionTitle}>推荐文章</h2>
        <div className={styles.articleGrid}>
          {!loading && recommendedArticles.map((item) => <ArticleItem key={item.id} {...item} />)}
          {loading && <p>正在加载推荐文章...</p>}
        </div>
      </div>
    </div>
  )
}
