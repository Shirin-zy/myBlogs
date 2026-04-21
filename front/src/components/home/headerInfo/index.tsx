'use client'

import styles from "./index.module.less"
import DescCard from "@/components/home/headerInfo/descCard"
import Recommend from "@/components/home/headerInfo/recommend"
import { icons } from "@/assets/logo"
const HeaderInfo = () => {
    return (
        <div className={styles.headerInfo}>
            <div className={styles.left}>
                <div>
                    <DescCard title="项目介绍" subtitle="这是一个基于 React 的项目，用于测试使用。" icons={icons} />
                </div>
                <div className={styles.category}>
                    <div className={styles.item}>教程</div>
                    <div className={styles.item}>热门</div>
                    <div className={styles.item}>精选</div>
                </div>
            </div>
            <div className={styles.right}>
                <Recommend />
            </div>
        </div>
    )
}

export default HeaderInfo
