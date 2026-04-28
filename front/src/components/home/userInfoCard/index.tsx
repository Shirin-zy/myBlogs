'use client'

import React from 'react';
import styles from './index.module.less';
import avatar from '@/assets/avatar.jpg';
import avatarBg from '@/assets/avatarBg.jpg';

interface UserInfoCardProps {
    className?: string;
    /** 自定义宽度，默认为 100% */
    width?: string | number;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ className, width }) => {
    const tags = [
        '#HTML',
        '#CSS',
        '#JS',
        '#JQ',
        '#bootstrap',
        '#PR',
        '#AE',
        '#Vscode',
    ];

    return (
        <div
            className={`${styles.container} ${className || ''}`}
            style={{ width: width ?? '100%' }}
        >
            <div className={styles.shell}>
                {/* 头像 - 在纵向模式下会居中显示 */}
                <img
                    src={avatar.src}
                    alt="Avatar"
                    className={styles.cover}
                />

                {/* 头部背景 */}
                <div className={styles.head}>
                    {/* 背景层 */}
                    <div
                        className={styles.bg}
                        style={{ backgroundImage: `url(${avatarBg.src})` }}
                    />
                    <div className={styles.data}>
                        <div className={styles.title1}>
                            Shinanoゎ
                            <span>BILIBILI</span>
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
                            Hello everyone, I am a junior girl, I am very glad to have the
                            opportunity to introduce myself to you. I have a strong interest in
                            CSS and love sports. First, let me talk about my love of CSS. CSS is
                            a language for web design and layout that makes web pages beautiful,
                            readable, and easy to navigate. One of the things I like about CSS
                            is its flexibility, by using different styles and layouts...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoCard;
