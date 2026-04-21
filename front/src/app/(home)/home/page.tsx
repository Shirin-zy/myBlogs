'use client'

// import Player from "@/components/videoPlayer/player"
import style from "./page.module.less"
import Player from "@/components/home/videoPlayer"
import HeaderInfo from "@/components/home/headerInfo"
import WebMessage from "@/components/home/headerMessage"
import Article from "@/components/home/article"
import SideInfo from "@/components/home/sideInfo"
// import { Spin } from "antd"
import { useEffect, useState } from "react"

const Home = () => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const handleLoad = () => setLoading(false)

        if (document.readyState === "complete") {
            setLoading(false)
        } else {
            window.addEventListener("load", handleLoad)
        }

        return () => window.removeEventListener("load", handleLoad)
    }, [])

    // if (loading) {
    //     return (
    //         <div className={style.loadingContainer}>
    //             <Spin size="large" tip="Loading..." />
    //         </div>
    //     )
    // }

    return (
        <div className={style.bg}>
            <Player videoSrc="https://fastcdn.mihoyo.com/content-v2/plat/100679/07eb4e7f8b897af4d6f6be9e54e5cbe8_763253631022293740.mp4" />
            <div className={style.container}>
                <WebMessage message="这是一个基于 React 的项目，用于测试使用" />
                <HeaderInfo />
                <div className={style.content}>
                    <Article />
                    <SideInfo />
                </div>
            </div>
        </div>
    )
}

export default Home
