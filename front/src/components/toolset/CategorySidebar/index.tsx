import React, { useEffect, useRef } from "react"
import * as LucideIcons from "lucide-react"
import styles from "./index.module.less"

export interface Category {
  id: string
  name: string
  icon: string
}

interface CategorySidebarProps {
  categories: Category[]
  activeId: string
  onSelect: (id: string) => void
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories, activeId, onSelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeItemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeItemRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const activeItem = activeItemRef.current

      // 只有在小屏幕（横向滚动模式）下才自动滚动
      if (window.innerWidth <= 768) {
        const containerWidth = container.offsetWidth
        const itemWidth = activeItem.offsetWidth
        const itemLeft = activeItem.offsetLeft

        // 计算居中滚动位置
        const scrollLeft = itemLeft - containerWidth / 2 + itemWidth / 2

        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        })
      }
    }
  }, [activeId])

  return (
    <div className={styles.sidebar} ref={scrollContainerRef}>
      {categories.map((category) => {
        const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.LayoutGrid
        const isActive = activeId === category.id
        return (
          <div
            key={category.id}
            ref={isActive ? activeItemRef : null}
            className={`${styles.item} ${isActive ? styles.active : ""}`}
            onClick={() => onSelect(category.id)}
          >
            <span className={styles.icon}>
              <IconComponent size={18} />
            </span>
            <span className={styles.name}>{category.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export default CategorySidebar
