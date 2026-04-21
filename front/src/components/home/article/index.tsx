'use client'

import styles from "./index.module.less"
import { ArticleProps } from "./interface"
import ArticleItem from "./articleItem/index"
import { useState, useEffect } from "react"
import { http } from "@/lib/http"

interface FilterProps {
    categorys: { name: string; type: string }[]
}

const Filter = (props: FilterProps) => {
    const { categorys } = props
    return (
        <div className={styles.category}>
            {categorys.map((item) => (
                <div key={item.type} className={styles.categoryItem}>
                    {item.name}
                </div>
            ))}
        </div>
    )
}


const Article = () => {
    const [articles, setArticles] = useState<ArticleProps[]>([])

    const getArticles = async () => {
        try {
            const data = await http.get<ArticleProps[]>('/blogs/articleList/')
            setArticles(data)
        } catch (error) {
            console.error('获取文章列表失败:', error)
        }
    }
    useEffect(() => {
        getArticles()
    }, [])

    const category = [
        { name: "全部", type: "all" },
        { name: "热门", type: "1" },
        { name: "最新", type: "2" },
        { name: "杂项", type: "3" },
        { name: ">> 更多", type: "more" },
    ]

    return (
        <div className={styles.content}>
            <Filter categorys={category} />
            <div className={styles.article}>
                {articles.length > 0 && articles.map((item) => (
                    <ArticleItem key={item.id} {...item} />
                ))}
            </div>
        </div>
    )
}
export default Article
