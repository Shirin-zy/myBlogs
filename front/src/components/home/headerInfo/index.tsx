"use client"

import { useRouter } from "next/navigation"
import styles from "./index.module.less"
import DescCard from "@/components/home/headerInfo/descCard"
import Recommend from "@/components/home/headerInfo/recommend"
import { icons } from "@/assets/logo"
const HeaderInfo = () => {
  const router = useRouter()
  return (
    <div className={styles.headerInfo}>
      <div className={styles.left}>
        <div>
          <DescCard title="寻仙觅机" subtitle="欲买桂花同载酒，终不似，少年游。" icons={icons} />
        </div>
        <div className={styles.category}>
          <div className={styles.item} onClick={() => router.push("/404")}>
            教程
          </div>
          <div className={styles.item} onClick={() => router.push("/404")}>
            热门
          </div>
          <div className={styles.item} onClick={() => router.push("/404")}>
            精选
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <Recommend />
      </div>
    </div>
  )
}

export default HeaderInfo
