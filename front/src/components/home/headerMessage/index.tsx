'use client'

import React from "react"
import styles from "./index.module.less"
const WebMessag = ({ message }: { message: string }) => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <span className={styles.message}>{message}</span>
            </div>
        </div>
    )
}

export default WebMessag
