"use client"

import React, { useState, useEffect, useMemo } from "react"
import { FileText, Clock, Type, Users, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useApi } from "@/hooks/api-context"
import { type Tag } from "@/lib/api/article"
import { type ResponsesiteInfo, type overview } from "@/lib/api/others"

import styles from "./index.module.less"

const SiteInfoCard: React.FC = () => {
  const api = useApi()
  const router = useRouter()
  const [tags, setTags] = useState<Tag[]>([])
  const [siteInfo, setSiteInfo] = useState<ResponsesiteInfo>()

  const fetchTags = async () => {
    const res = await api.article.getTagsSummary()
    setTags(res.slice(0, 25))
  }

  const fetchSiteInfo = async () => {
    const res = await api.others.getSiteInfo()
    setSiteInfo(res)
  }

  useEffect(() => {
    fetchTags()
    fetchSiteInfo()
  }, [])

  // 使用 useMemo 缓存统计数据
  const stats = useMemo(() => {
    // 起始时间
    const start = new Date("2026-05-01T00:00:00")
    // 当前时间
    const now = new Date()

    // 时间戳差值 毫秒转天数
    const diffMs = now.getTime() - start.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    return [
      { icon: <FileText size={16} />, label: "文章总数", value: siteInfo?.total_articles || "0" },
      { icon: <Clock size={16} />, label: "建站天数", value: `${diffDays} 天` },
      { icon: <Type size={16} />, label: "全站字数", value: siteInfo?.total_words || "0" },
      { icon: <Users size={16} />, label: "总访客数", value: "暂无" },
      { icon: <BarChart3 size={16} />, label: "总访问量", value: "暂无" },
    ]
  }, [siteInfo])

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
          {siteInfo?.monthly_stats?.map((item, index) => (
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
