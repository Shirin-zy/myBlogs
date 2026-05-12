"use client"

import React from "react"
import styles from "./index.module.less"
import avatar from "@/assets/avatar.jpg"
import avatarBg from "@/assets/avatarBg.jpg"

interface UserInfoCardProps {
  className?: string
  /** 自定义宽度，默认为 100% */
  width?: string | number
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ className, width }) => {
  const tags = ["#TS", "#React", "#UmiJS", "#NextJS", "#Vue", "#Python", "#FastAPI"]

  return (
    <div className={`${styles.container} ${className || ""}`} style={{ width: width ?? "100%" }}>
      <div className={styles.shell}>
        {/* 头像 - 在纵向模式下会居中显示 */}
        <img src={avatar.src} alt="Avatar" className={styles.cover} />

        {/* 头部背景 */}
        <div className={styles.head}>
          {/* 背景层 */}
          <div className={styles.bg} style={{ backgroundImage: `url(${avatarBg.src})` }} />
          <div className={styles.data}>
            <div className={styles.title1}>
              Shinanoゎ
              <span
                className={styles.bilibili}
                onClick={() => window.open("https://space.bilibili.com/39473070?spm_id_from=333.1007.0.0")}
              >
                BILIBILI
              </span>
            </div>
            <div className={styles.title2}>这个人很神秘</div>
          </div>
        </div>

        {/* 底部内容区 */}
        <div className={styles.foot}>
          <div className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.introduce}>
            <p>
              Hello everyone, welcome to my personal blog. I am a guy from Chongqing who likes watching anime and
              exploring new things. This blog is only for learning and testing purposes and does not involve any
              commercial use.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfoCard
