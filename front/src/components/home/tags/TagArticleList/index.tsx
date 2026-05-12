import React from 'react'
import styles from './index.module.less'
import { useRouter } from 'next/navigation'
import { type ArticleItem as ArticleProps } from '@/lib/api/article'

interface TagArticleListProps {
    tagName: string
    articles: ArticleProps[]
}

const TagArticleList: React.FC<TagArticleListProps> = ({ tagName, articles }) => {
    const router = useRouter()

    // 按年份分组文章
    const groupedArticles = articles.reduce((acc, article) => {
        const year = new Date(article.created_at).getFullYear().toString()
        if (!acc[year]) {
            acc[year] = []
        }
        acc[year].push(article)
        return acc
    }, {} as Record<string, ArticleProps[]>)

    const years = Object.keys(groupedArticles).sort((a, b) => b.localeCompare(a))

    return (
        <div className={styles.container}>
            <h2 className={styles.tagName}>{tagName}</h2>
            
            {years.map(year => (
                <div key={year} className={styles.yearSection}>
                    <div className={styles.yearHeader}>{year}</div>
                    <div className={styles.articleList}>
                        {groupedArticles[year].map((article, index) => (
                            <div 
                                key={article.id} 
                                className={styles.articleItem}
                                onClick={() => router.push(`/article/${article.id}`)}
                            >
                                <div className={styles.left}>
                                    <div className={styles.cover}>
                                        <img src={article.bgPicture} alt={article.title} />
                                    </div>
                                    <div className={styles.info}>
                                        <h3 className={styles.title}>{article.title}</h3>
                                        <div className={styles.tags}>
                                            {article.tags.map(tag => (
                                                <span key={tag} className={styles.tag}>#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.rank}>{index + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TagArticleList
