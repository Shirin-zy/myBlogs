"use client"

import React, { useEffect, useState, useRef } from "react"
import styles from "./index.module.less"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useApi } from "@/hooks/api-context"
import { type AarchiveItem } from "@/lib/api/article"

interface TimelineProps {
  archives?: AarchiveItem[]
  mainTitle?: string
  subtitle?: string
}

const Timeline: React.FC<TimelineProps> = ({ archives, mainTitle = "文章时间线归档", subtitle = "MEMORIES" }) => {
  const api = useApi()
  const [archive, setArchive] = useState<AarchiveItem[]>([])
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const shellRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const fetchData = async () => {
    const response = await api.article.getArchive()
    setArchive(response || [])
  }
  useEffect(() => {
    fetchData()
  }, [])

  const items = archives || archive

  useEffect(() => {
    const handleScroll = () => {
      if (!shellRef.current) return

      const windowHeight = window.innerHeight
      const triggerPoint = window.scrollY + windowHeight / 3

      let newActiveIndex = activeIndex

      itemRefs.current.forEach((item, index) => {
        if (!item) return

        const min = item.offsetTop
        const max = min + item.offsetHeight

        if (triggerPoint >= min && triggerPoint <= max) {
          newActiveIndex = index
        }
      })

      // 检查是否滚到底部，若是则激活最后一项
      const scrollHeight = document.documentElement.scrollHeight
      const pos = window.scrollY
      if (pos + windowHeight >= scrollHeight - 100) {
        newActiveIndex = items.length - 1
      }

      if (newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex)
      }
    }

    window.addEventListener("scroll", handleScroll)
    // 初始化执行一次
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [activeIndex, items.length])

  // 背景图片随 activeIndex 变化
  const currentBg = items[activeIndex]?.imgUrl || ""

  return (
    <div className={styles.shell} ref={shellRef} style={{ backgroundImage: `url(${currentBg})` }}>
      <button className={styles.backButton} onClick={() => router.back()} title="返回上次页面">
        <ArrowLeft size={20} />
        <span>返回</span>
      </button>

      <div className={styles.header}>
        <h2 className={styles.title}>{mainTitle}</h2>
        <h3 className={styles.subtitle}>{subtitle}</h3>
      </div>

      <div className={styles.timeline}>
        {items.map((item, index) => (
          <div
            onClick={() => router.push(`/article/${item.id}`)}
            key={item.id}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className={`${styles.item} ${activeIndex === index ? styles.active : ""}`}
            data-text={item.title}
          >
            <div className={styles.content}>
              <img src={item.imgUrl} alt={item.title} className={styles.img} />
              <h2 className={styles.contentTitle}>{item.year}</h2>
              <p className={styles.contentDesc}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline
