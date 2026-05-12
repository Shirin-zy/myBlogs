import React from 'react'
import styles from './index.module.less'

interface Tag {
    name: string
    count: number
}

interface TagCloudProps {
    tags: Tag[]
    activeTag: string
    onTagClick: (tag: string) => void
}

const TagCloud: React.FC<TagCloudProps> = ({ tags, activeTag, onTagClick }) => {
    return (
        <div className={styles.tagCloud}>
            {tags.map((tag) => (
                <div
                    key={tag.name}
                    className={`${styles.tagItem} ${activeTag === tag.name ? styles.active : ''}`}
                    onClick={() => onTagClick(tag.name)}
                >
                    <span className={styles.hashtag}>#</span>
                    <span className={styles.name}>{tag.name}</span>
                    <span className={styles.count}>{tag.count}</span>
                </div>
            ))}
        </div>
    )
}

export default TagCloud
