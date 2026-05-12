"use client"

import React, { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import TagCloud from "@/components/home/tags/TagCloud"
import TagArticleList from "@/components/home/tags/TagArticleList"
import { useApi } from "@/hooks/api-context"
import { type ArticleItem as ArticleProps, type Tag } from "@/lib/api/article"
import UserInfoCard from "@/components/home/userInfoCard"
import Calendar from "@/components/home/calendar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Loader from "@/components/others/loading"
import bgImg from "@/assets/02.jpg"
import styles from "./page.module.less"

function TagsContent() {
  const { article } = useApi()
  const searchParams = useSearchParams()
  const tagParam = searchParams.get("tag")

  const [tags, setTags] = useState<Tag[]>([])
  const [activeTag, setActiveTag] = useState<string>(tagParam || "")
  const [articles, setArticles] = useState<ArticleProps[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  // 1. 初始化获取标签列表
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagData = await article.getTagsSummary()
        setTags(tagData)
        // 只有当当前没有 activeTag（URL 没传且还没初始化）时，才设置默认第一个标签
        if (!activeTag && tagData.length > 0) {
          setActiveTag(tagData[0].name)
        }
      } catch (error) {
        console.error("获取标签失败:", error)
      }
    }
    fetchTags()
  }, [article])

  // 2. 监听 URL 参数变化，同步到 state
  useEffect(() => {
    if (tagParam && tagParam !== activeTag) {
      setActiveTag(tagParam)
      setCurrentPage(1)
    }
  }, [tagParam])

  // 3. 获取文章列表逻辑 (抽取为通用方法)
  const fetchArticleData = useCallback(
    async (tag: string, page: number) => {
      setLoading(true)
      try {
        const data = await article.getArticles({ tag, page, limit: pageSize })
        setArticles(data.list || [])
        setTotal(data.total || 0)
      } catch (error) {
        console.error("获取文章列表失败:", error)
      } finally {
        setLoading(false)
      }
    },
    [article, pageSize],
  )

  // 4. 统一的数据请求 Effect
  // 只有在 activeTag 确定后才发起请求，避免初始为空时的无效请求
  useEffect(() => {
    if (!activeTag) return
    fetchArticleData(activeTag, currentPage)
  }, [activeTag, currentPage, fetchArticleData])

  // 5. 标签切换处理
  const handleTagChange = (newTag: string) => {
    if (newTag === activeTag) return
    setActiveTag(newTag)
    setCurrentPage(1) // 重置页码。由于 activeTag 变了，上面的 Effect 会被触发。
  }

  // 6. 页码切换处理
  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(total / pageSize)
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <TagCloud tags={tags} activeTag={activeTag} onTagClick={handleTagChange} />

        {loading ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : (
          <TagArticleList tagName={activeTag} articles={articles} />
        )}

        {/* 分页组件 */}
        {!loading && Math.ceil(total / pageSize) > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>

            {[...Array(Math.ceil(total / pageSize))].map((_, i) => {
              const pageNum = i + 1
              if (
                pageNum === 1 ||
                pageNum === Math.ceil(total / pageSize) ||
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    className={`${styles.pageBtn} ${currentPage === pageNum ? styles.active : ""}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                return (
                  <span key={pageNum} className={styles.pageInfo}>
                    ...
                  </span>
                )
              }
              return null
            })}

            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(total / pageSize)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.rightSidebar}>
        <div className={styles.stickyWrapper}>
          <UserInfoCard width={350} />
          <Calendar width={350} bgImage={bgImg.src} />
        </div>
      </div>
    </div>
  )
}

export default function TagsPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      }
    >
      <TagsContent />
    </Suspense>
  )
}
