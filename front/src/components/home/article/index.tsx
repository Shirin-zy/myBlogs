"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import styles from "./index.module.less"
import { type ArticleItem as ArticleProps } from "@/lib/api/article"
import ArticleItem from "./articleItem/index"
import { useApi } from "@/hooks/api-context"
import Loader from "@/components/others/loading"

interface FilterProps {
  categorys: { name: string; type: string }[]
  currentCategory: string
  setCurrentCategory: (category: string) => void
}

const Filter = (props: FilterProps) => {
  const { categorys, currentCategory, setCurrentCategory } = props
  return (
    <div className={styles.category}>
      {categorys.map((item) => (
        <div
          key={item.type}
          className={[styles.categoryItem, item.type === currentCategory ? styles.active : ""].join(" ")}
          onClick={() => setCurrentCategory(item.type)}
        >
          {item.name}
        </div>
      ))}
    </div>
  )
}

const Article = () => {
  const [articles, setArticles] = useState<ArticleProps[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const isFirstRender = useRef(true)
  const [currentCategory, setCurrentCategory] = useState("all")
  const [loading, setLoading] = useState(false)
  const pageSize = 6
  const router = useRouter()

  const { article } = useApi()

  const getArticles = useCallback(
    async (page: number, category?: string) => {
      setLoading(true)
      try {
        const data = await article.getArticles({ page, limit: pageSize, category })
        setArticles(data.list || [])
        setTotal(data.total || 0)
      } catch (error) {
        console.error("获取文章列表失败:", error)
      } finally {
        setLoading(false)
      }
    },
    [article],
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [currentCategory])

  useEffect(() => {
    if (currentCategory === "all") {
      getArticles(currentPage)
    } else if (currentCategory === "more") {
      router.push("/more")
    } else {
      getArticles(currentPage, currentCategory)
    }
    if (!isFirstRender.current) {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
    } else {
      isFirstRender.current = false
    }
  }, [currentPage, currentCategory, getArticles])

  const totalPages = Math.ceil(total / pageSize)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const category = [
    { name: "全部", type: "all" },
    { name: "前端", type: "前端技术" },
    { name: "后端", type: "后端技术" },
    { name: "随笔", type: "日常随笔" },
    { name: ">> 更多", type: "more" },
  ]

  return (
    <div className={styles.content}>
      <Filter categorys={category} currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} />
      <div className={styles.article}>
        {loading ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : (
          articles.length > 0 && articles.map((item) => <ArticleItem key={item.id} {...item} />)
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1
            // 简单的分页逻辑：只显示当前页附近的页码
            if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)) {
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
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
export default Article
