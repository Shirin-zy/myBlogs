'use client'

import React from 'react';
import { FileText, Clock, Type, Users, BarChart3 } from 'lucide-react';
import styles from './index.module.less';

const SiteInfoCard: React.FC = () => {
  const tags = [
    { name: 'AI', count: 1 },
    { name: 'Chrome扩展', count: 1 },
    { name: 'Germini', count: 1 },
    { name: 'Github项目', count: 1 },
    { name: 'Google', count: 2 },
    { name: '代理软件', count: 1 },
    { name: '影音播放', count: 1 },
    { name: '微软', count: 1 },
    { name: '机场', count: 1 },
    { name: '热门', count: 2 },
    { name: '精选', count: 2 },
    { name: '网络代理', count: 1 },
    { name: '脚本', count: 1 },
    { name: '账户注册', count: 1 },
    { name: '账户问题', count: 1 },
  ];

  const archives = [
    { month: '十二月', year: '2025', count: 1 },
    { month: '十一月', year: '2025', count: 2 },
    { month: '十一月', year: '2023', count: 2 },
  ];

  const stats = [
    { icon: <FileText size={16} />, label: '文章总数', value: '5' },
    { icon: <Clock size={16} />, label: '建站天数', value: '1143 天' },
    { icon: <Type size={16} />, label: '全站字数', value: '3.2k' },
    { icon: <Users size={16} />, label: '总访客数', value: '32220' },
    { icon: <BarChart3 size={16} />, label: '总访问量', value: '48047' },
  ];

  return (
    <div className={styles.card}>
      {/* 标签云部分 */}
      <div className={styles.section}>
        <div className={styles.tagCloud}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tagItem}>
              {tag.name}
              <sup className={styles.sup}>{tag.count}</sup>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      {/* 归档部分 */}
      <div className={styles.section}>
        <div className={styles.archiveGrid}>
          {archives.map((item, index) => (
            <div key={index} className={styles.archiveItem}>
              <div className={styles.archiveDate}>
                {item.month} {item.year}
              </div>
              <div className={styles.archiveCount}>
                <strong>{item.count}</strong> 篇
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      {/* 统计部分 */}
      <div className={styles.section}>
        <div className={styles.statsList}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <div className={styles.statLabel}>
                <span className={styles.icon}>{stat.icon}</span>
                {stat.label}：
              </div>
              <div className={styles.statValue}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteInfoCard;
