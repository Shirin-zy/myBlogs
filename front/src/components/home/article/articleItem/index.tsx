'use client'

import styles from "./index.module.less"
import { MessageCircle } from "lucide-react"
import { type ArticleItem as ArticleProps } from "@/lib/api/article"

const ArticleItem = (props: ArticleProps) => {
    const { id, title, created_at, tags, category, is_new, bgPicture, comment } = props
    return (
        <div className={styles.card}>
            <div className={styles.cover}>
                <div className={styles.tag}>{category}</div>
                <img src={bgPicture} alt="cover" />
            </div>
            <div className={styles.info}>
                <div className={styles.meta}>
                    <span>{category}</span>
                    {is_new && <span className={styles.highlight}>最新</span>}
                </div>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.footer}>
                    <div className={styles.left}>
                        <MessageCircle className={styles.icon} /> {comment}
                    </div>
                    <div className={styles.tags}>
                        {tags.map((tag) => (
                            <span key={tag} className={styles.tagItem}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className={styles.date}>{created_at}</div>
                </div>
            </div>
        </div>
    )
}

export default ArticleItem
