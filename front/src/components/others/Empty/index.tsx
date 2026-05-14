import React from 'react';
import { Inbox } from 'lucide-react';
import styles from './index.module.less';

interface EmptyProps {
  description?: string;
  image?: React.ReactNode;
}

const Empty: React.FC<EmptyProps> = ({ 
  description = '暂无数据', 
  image = <Inbox size={64} strokeWidth={1} /> 
}) => {
  return (
    <div className={styles.empty}>
      <div className={styles.image}>{image}</div>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default Empty;
