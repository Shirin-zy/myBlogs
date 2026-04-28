'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './index.module.less'
import { RotateCcw } from 'lucide-react'

const footerData = [
    {
        title: '联系我',
        links: [
            { label: 'QQ群', href: '#' },
            { label: 'QQ', href: '#' },
            { label: '其他', href: '#' },
        ]
    },
    {
        title: '网站',
        links: [
            { label: '文档', href: '#' },
            { label: '源码', href: '#' },
            { label: '更新日志', href: '#' },
        ]
    },
    {
        title: '导航',
        links: [
            { label: '即刻短文', href: '#' },
            { label: '友链文章', href: '#' },
            { label: '留言板', href: '#' },
        ]
    },
    {
        title: '协议',
        links: [
            { label: '隐私协议', href: '#' },
            { label: 'Cookies', href: '#' },
            { label: '版权协议', href: '#' },
        ]
    },
    {
        title: '友链',
        links: [
            { label: '更多', href: '#' },
        ],
        showRefresh: true
    }
]

const Footer = () => {
    const [runningTime, setRunningTime] = useState('')

    useEffect(() => {
        const startTime = new Date('2023-01-01T00:00:00').getTime()

        const updateTimer = () => {
            const now = new Date().getTime()
            const diff = now - startTime

            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            setRunningTime(`${days} 天 ${hours.toString().padStart(2, '0')} 小时 ${minutes.toString().padStart(2, '0')} 分 ${seconds.toString().padStart(2, '0')} 秒`)
        }

        const timer = setInterval(updateTimer, 1000)
        updateTimer()

        return () => clearInterval(timer)
    }, [])

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Top Section */}
                <div className={styles.topSection}>
                    <div className={styles.copyright}>
                        ©2023 - {new Date().getFullYear()} By Mutec
                    </div>
                    <div className={styles.badgeLine}>
                        <span className={styles.miniBadge}>记录美好</span>
                    </div>
                    <div className={styles.status}>
                        本站居然运行了 {runningTime} ❤️
                    </div>
                </div>

                {/* Middle Section */}
                <div className={styles.middleSection}>
                    {footerData.map((section, idx) => (
                        <div key={idx} className={styles.column}>
                            <h4 className={styles.columnTitle}>
                                {section.title}
                                {section.showRefresh && <RotateCcw size={14} className={styles.refreshIcon} />}
                            </h4>
                            <ul className={styles.linkList}>
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link href={link.href} className={styles.link}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className={styles.bottomSection}>
                    <div className={styles.badges}>
                        <div className={styles.badge} onClick={() => { window.open('https://nextjs.org/') }}>
                            <span className={styles.badgeKey}>Frame</span>
                            <span className={styles.badgeValue}>Next.js</span>
                        </div>
                        <div className={styles.badge} onClick={() => { window.open('https://github.com/Shirin-zy/myBlogs') }}>
                            <span className={styles.badgeKey}>Source</span>
                            <span className={styles.badgeValue}>Github</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
