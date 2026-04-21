'use client'

import React, { useState } from "react"
import styles from "./index.module.less"



interface RecommendProps {
    imgUrl?: string
    title?: string
    isSticky?: boolean
    items?: { title: string; imgUrl: string; isSticky?: boolean }[]
}

const Recommend: React.FC<RecommendProps> = ({
    imgUrl = "https://images.unsplash.com/photo-1707343843437-caacff5cfa74", // Default placeholder
    title = "点我看看闲言碎语",
    isSticky = true,
    items = [
        {
            title: "科学上网完整教程",
            imgUrl:
                "https://www.bing.com/th?id=OHR.BubblesAbraham_ZH-CN7203734882_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            isSticky: true,
        },
        {
            title: "机场使用完整指南 - 从注册到节点选择",
            imgUrl:
                "https://www.bing.com/th?id=OHR.WalesWinter_ZH-CN3692879767_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
        },
        {
            title: "买完号如何查看 Google 账号准确注册日期?",
            imgUrl:
                "https://www.bing.com/th?id=OHR.GermanyNewYear_ZH-CN9155122755_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
        },
        {
            title: "一款多平台视频解析桌面小工具",
            imgUrl:
                "https://www.bing.com/th?id=OHR.AntarcticArch_ZH-CN1622701432_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
        },
        {
            title: "薅羊毛神器：利用插件刷取 Microsoft Rewards ...",
            imgUrl:
                "https://www.bing.com/th?id=OHR.LagoonNebula_ZH-CN3890147543_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
        },
    ],
}) => {
    const [showGrid, setShowGrid] = useState(false)

    return (
        <div className={styles.container}>
            <div className={`${styles.gridContainer} ${showGrid ? "" : styles.hidden}`}>
                {items.map((item, index) => (
                    <div key={index} className={styles.smallCard}>
                        <img src={item.imgUrl} alt={item.title} className={styles.smallCardBg} />
                        <div className={styles.smallCardOverlay} />
                        <div className={styles.smallCardContent}>
                            {item.isSticky && <span className={styles.smallStickyLabel}>荐</span>}
                            <h3 className={styles.smallCardTitle}>{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
            <div className={`${styles.recommendCard} ${showGrid ? styles.hidden : ""}`}>
                <img src={imgUrl} alt="recommend-bg" className={styles.bgImage} />
                <div className={styles.overlay} />

                <div className={styles.content}>
                    <div className={styles.leftInfo}>
                        {isSticky && <span className={styles.stickyLabel}>置顶</span>}
                        <div className={styles.titleWrapper}>
                            <h2 className={styles.title}>{title}</h2>
                        </div>
                    </div>

                    <button className={styles.moreBtn} onClick={() => setShowGrid(true)}>
                        更多推荐
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Recommend
