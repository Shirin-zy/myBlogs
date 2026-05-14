import React from "react"
import { ChevronRight, Globe } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import styles from "./index.module.less"

interface ToolCardProps {
  name: string
  desc: string
  icon?: string
  url: string
}

const ToolCard: React.FC<ToolCardProps> = ({ name, desc, icon, url }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={styles.card} onClick={() => window.open(url, "_blank")}>
            <div className={styles.left}>
              <div className={styles.iconWrapper}>
                {icon ? (
                  <img src={icon} alt={name} className={styles.icon} />
                ) : (
                  <Globe size={20} className={styles.defaultIcon} />
                )}
              </div>
            </div>
            <div className={styles.center}>
              <h3 className={styles.title}>{name}</h3>
              <p className={styles.desc}>{desc}</p>
            </div>
            <div className={styles.right}>
              <ChevronRight size={18} className={styles.arrow} />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className={styles.tooltipContent}>
          <p>{desc}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ToolCard
