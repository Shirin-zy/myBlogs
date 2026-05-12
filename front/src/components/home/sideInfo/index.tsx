"use client"

import React, { useState, useEffect } from "react"
import { FileText, Clock, Type, Users, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useApi } from "@/hooks/api-context"
import { type Tag } from "@/lib/api/article"
import styles from "./index.module.less"

const SiteInfoCard: React.FC = () => {
  const api = useApi()
  const router = useRouter()
  const [tags, setTags] = useState<Tag[]>([])

  const fetchTags = async () => {
    const res = await api.article.getTagsSummary()
    setTags(res.slice(0, 25))
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const archives = [
    { month: "十二月", year: "2025", count: 1 },
    { month: "十一月", year: "2025", count: 2 },
    { month: "十一月", year: "2023", count: 2 },
  ]

  const stats = [
    { icon: <FileText size={16} />, label: "文章总数", value: "5" },
    { icon: <Clock size={16} />, label: "建站天数", value: "1143 天" },
    { icon: <Type size={16} />, label: "全站字数", value: "3.2k" },
    { icon: <Users size={16} />, label: "总访客数", value: "32220" },
    { icon: <BarChart3 size={16} />, label: "总访问量", value: "48047" },
  ]

  return (
    <div className={styles.card}>
      {/* 标签云部分 */}
      <div className={styles.section}>
        <div className={styles.tagCloud}>
          {tags.map((tag, index) => (
            <span key={index} onClick={() => router.push(`/tags?tag=${tag.name}`)} className={styles.tagItem}>
              {tag.name}
              <sup className={styles.sup}>{tag.count}</sup>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      {/* 归档部分 */}
      <div className={styles.section}>
        <div className={styles.archiveGrid}>
          {archives.map((item, index) => (
            <div key={index} className={styles.archiveItem}>
              <div className={styles.archiveDate}>
                {item.month} {item.year}
              </div>
              <div className={styles.archiveCount}>
                <strong>{item.count}</strong> 篇
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      {/* 统计部分 */}
      <div className={styles.section}>
        <div className={styles.statsList}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <div className={styles.statLabel}>
                <span className={styles.icon}>{stat.icon}</span>
                {stat.label}：
              </div>
              <div className={styles.statValue}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SiteInfoCard
