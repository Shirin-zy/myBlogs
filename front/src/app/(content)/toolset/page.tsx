"use client"

import React, { useState, useEffect, useCallback } from "react"
import CategorySidebar, { type Category } from "@/components/toolset/CategorySidebar"
import ToolCard from "@/components/toolset/ToolCard"
import { type Website } from "@/lib/api/others"
import { useApi } from "@/hooks/api-context"
import Loader from "@/components/others/loading"
import Empty from "@/components/others/Empty"
import styles from "./page.module.less"

// Mock data
const CATEGORIES: Category[] = [
  { id: "ai-tools", name: "AI 工具", icon: "Bot" },
  { id: "design-drawing", name: "绘图设计", icon: "Palette" },
  { id: "dev-tools", name: "开发工具", icon: "Code" },
  { id: "video-music", name: "影音资源", icon: "Video" },
  { id: "material-resources", name: "设计素材", icon: "Library" },
  { id: "others", name: "其它", icon: "MoreHorizontal" },
]

const ToolsetPage = () => {
  const api = useApi()
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0].id) // Default to AI 工具
  const [loading, setLoading] = useState(true)
  const [toolsets, setToolsets] = useState<Website[]>([])

  const fetchToolsets = useCallback(
    async (categoryId: string) => {
      setLoading(true)
      try {
        const res = await api.others.getToolsets({ categoryId })
        setToolsets(res || [])
      } catch (error) {
        console.error("Error fetching toolsets:", error)
      } finally {
        setLoading(false)
      }
    },
    [api],
  )

  useEffect(() => {
    fetchToolsets(activeCategoryId)
  }, [activeCategoryId, fetchToolsets])

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.sidebarSection}>
          <CategorySidebar categories={CATEGORIES} activeId={activeCategoryId} onSelect={setActiveCategoryId} />
        </div>
        <div className={styles.contentSection}>
          <div className={styles.header}>
            <h2 className={styles.title}>{CATEGORIES.find((c) => c.id === activeCategoryId)?.name}</h2>
          </div>

          {loading ? (
            <div className={styles.loadingWrapper}>
              <Loader />
            </div>
          ) : toolsets.length > 0 ? (
            <div className={styles.grid}>
              {toolsets.map((tool) => (
                <ToolCard key={tool.id} name={tool.name} desc={tool.desc} url={tool.url} icon={tool.iconUrl} />
              ))}
            </div>
          ) : (
            <Empty description="该分类下暂无工具" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ToolsetPage
