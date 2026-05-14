"use client"

import React, { useState, useEffect, useCallback } from "react"
import CategorySidebar, { type Category } from "@/components/toolset/CategorySidebar"
import ToolCard from "@/components/toolset/ToolCard"
import styles from "./page.module.less"
import { useApi } from "@/hooks/api-context"
import { type Website } from "@/lib/api/others"

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
  const [toolsets, setToolsets] = useState<Website[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0].id) // Default to AI 工具
  const fetchToolsets = useCallback(
    async (activeCategoryId: string) => {
      const toolsets = await api.toolset.getToolsets({ categoryId: activeCategoryId })
      setToolsets(toolsets)
    },
    [api, activeCategoryId],
  )

  useEffect(() => {
    fetchToolsets(activeCategoryId)
  }, [fetchToolsets])

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
          <div className={styles.grid}>
            {toolsets.map((tool) => (
              <ToolCard key={tool.id} name={tool.name} desc={tool.desc} url={tool.url} icon={tool.iconUrl} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolsetPage
