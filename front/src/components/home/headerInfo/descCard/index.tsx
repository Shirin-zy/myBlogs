'use client'

import React, { useState, useEffect, useMemo } from "react"
import styles from "./index.module.less"

type IconItem = {
    src?: string
    alt?: string
    bg?: string
    type?: string
    svg?: string | React.ReactNode
}

type DescCardProps = {
    title: string
    subtitle?: string
    icons: IconItem[]
    speed?: number
    ctaText?: string
    tilt?: number
}

const DescCard: React.FC<DescCardProps> = ({
    title,
    subtitle,
    icons,
    speed = 18,
    ctaText = "随便逛逛 →",
    tilt = -30,
}) => {
    // 客户端状态，用于存储随机生成的图标数据（二维数组：上下两行）
    const [beltItems, setBeltItems] = useState<IconItem[][]>([[], []])

    // 仅在客户端渲染后生成随机数据，避免 hydration mismatch
    useEffect(() => {
        const rows: IconItem[][] = [[], []]
        for (let row = 0; row < 2; row++) {
            for (let j = 0; j < Math.max(24, icons.length * 6); j++) {
                const icon = icons[Math.floor(Math.random() * icons.length)]
                rows[row].push(icon)
            }
        }
        setBeltItems(rows)
    }, [icons])

    const normalizeSvg = (s: string) =>
        s
            .replace(/`/g, "")
            .replace(/\swidth="[^"]*"/i, ' width="100%"')
            .replace(/\sheight="[^"]*"/i, ' height="100%"')

    const renderIcon = (icon: IconItem) => {
        if (icon.svg) {
            if (typeof icon.svg === "string") {
                return <span className={styles.svgWrap} dangerouslySetInnerHTML={{ __html: normalizeSvg(icon.svg) }} />
            }
            return icon.svg
        }
        if (icon.src) {
            return <img src={icon.src} alt={icon.alt || ""} />
        }
        if (icon.alt) {
            return <span>{icon.alt}</span>
        }
        return null
    }

    return (
        <div className={styles.card}>
            <div className={styles.iconsLayer}>
                <div className={styles.belt} style={{ transform: `rotate(${tilt}deg)` }}>
                    {[0, 1].map((row) => (
                        <div key={`row-${row}`} className={styles.beltLine} style={{ animationDuration: `${speed}s` }}>
                            {beltItems[row].map((icon, i) => (
                                <div key={`item-${row}-${i}`} className={styles.beltItem} style={{ background: icon.bg || "#fff" }}>
                                    {renderIcon(icon)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.front}>
                <div className={styles.texts}>
                    <span className={styles.title}>{title}</span>
                    {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
                </div>
            </div>
            <div className={styles.reveal}>
                <div className={styles.cta}>{ctaText}</div>
            </div>
        </div>
    )
}

export default DescCard
