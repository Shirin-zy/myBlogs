'use client'

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, useDragControls } from "framer-motion";

// 消息类型定义
type Message = {
    role: "user" | "assistant";
    content: string;
};

interface Props {
    visible: boolean
    setVisible: (val: boolean) => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function AIChatCard(props: Props) {
    const { visible, setVisible } = props
    // 状态管理
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "👋 你好呀！有什么我可以帮助你的吗？",
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dragControls = useDragControls();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    // 自动滚动到底部
    const scrollToBottom = () => {
        if (viewportRef.current) {
            viewportRef.current.scrollTo({
                top: viewportRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // 发送消息
    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const currentInput = inputValue.trim();
        const userMessage: Message = { role: "user", content: currentInput };

        // 1. 添加用户消息并清空输入框
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        // 2. 准备接收 AI 回复的消息对象
        const assistantMessage: Message = { role: "assistant", content: "" };
        setMessages((prev) => [...prev, assistantMessage]);

        try {
            const response = await fetch(`${API_BASE_URL}/llmApi/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.ok) throw new Error("网络请求失败");
            if (!response.body) throw new Error("未收到响应流");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                // 按照后端 \n 分隔解析 JSON
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed.content) {
                            accumulatedContent += parsed.content;
                            // 更新最后一条消息（即当前 AI 的回复）
                            setMessages((prev) => {
                                const newMessages = [...prev];
                                newMessages[newMessages.length - 1] = {
                                    ...newMessages[newMessages.length - 1],
                                    content: accumulatedContent,
                                };
                                return newMessages;
                            });
                        } else if (parsed.error) {
                            throw new Error(parsed.error);
                        }
                    } catch (e) {
                        console.error("解析流式数据失败:", e, line);
                    }
                }
            }
        } catch (error) {
            console.error("对话请求失败:", error);
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    content: "抱歉，我遇到了一些问题，请稍后再试。😭",
                };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 主卡片容器 - 活泼渐变+圆角+阴影
        // 使用 framer-motion 使其可拖拽
        visible && (
            <motion.div
                drag
                dragControls={dragControls}
                dragListener={false}
                dragMomentum={false}
                className="fixed bottom-24 right-8 z-[1001] w-full max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileDrag={{ scale: 1.02 }}
            >
                <Card className="overflow-hidden border-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 shadow-2xl rounded-3xl">
                    {/* 顶部标题栏 - 作为拖拽句柄 */}
                    <div
                        onPointerDown={(e) => dragControls.start(e)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-3xl flex items-center justify-between cursor-grab active:cursor-grabbing touch-none"
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 animate-pulse" />
                            <h3 className="font-bold text-lg select-none">智能小助手</h3>
                        </div>
                        <button onClick={() => setVisible(!visible)} className="group opacity-50 items-center justify-center relative z-10 [transition:all_0.5s_ease] rounded-[0.375rem] cursor-pointer focus-visible:outline-0">
                            <svg fill="currentColor" stroke="none" strokeWidth={0} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 overflow-visible [transition:transform_.35s_ease] group-hover:[transition-delay:.25s] [&_path]:[transition:transform_.35s_ease] group-hover:rotate-45">
                                <path className="group-hover:[transform:rotate(112.5deg)_translate(-27.2%,-80.2%)]" d="m3.45,8.83c-.39,0-.76-.23-.92-.62-.21-.51.03-1.1.54-1.31L14.71,2.08c.51-.21,1.1.03,1.31.54.21.51-.03,1.1-.54,1.31L3.84,8.75c-.13.05-.25.08-.38.08Z" />
                                <path className="group-hover:[transform:rotate(22.5deg)_translate(15.5%,-23%)]" d="m2.02,17.13c-.39,0-.76-.23-.92-.62-.21-.51.03-1.1.54-1.31L21.6,6.94c.51-.21,1.1.03,1.31.54.21.51-.03,1.1-.54,1.31L2.4,17.06c-.13.05-.25.08-.38.08Z" />
                                <path className="group-hover:[transform:rotate(112.5deg)_translate(-15%,-149.5%)]" d="m8.91,21.99c-.39,0-.76-.23-.92-.62-.21-.51.03-1.1.54-1.31l11.64-4.82c.51-.21,1.1.03,1.31.54.21.51-.03,1.1-.54,1.31l-11.64,4.82c-.13.05-.25.08-.38.08Z" />
                            </svg>
                        </button>
                    </div>

                    {/* 聊天记录区域 - 滚动条+活泼气泡 */}
                    <ScrollArea
                        className="h-[400px] p-4"
                        ref={scrollAreaRef}
                    >
                        {/* 注入一个 ref 到内部 viewport 以便精确滚动 */}
                        <div
                            ref={(el) => {
                                if (el) {
                                    const viewport = el.closest('[data-radix-scroll-area-viewport]') as HTMLDivElement;
                                    if (viewport) {
                                        (viewportRef as any).current = viewport;
                                    }
                                }
                            }}
                        />
                        <div className="space-y-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`flex items-start gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""
                                            }`}
                                    >
                                        {/* 头像 */}
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user"
                                                ? "bg-blue-500 text-white"
                                                : "bg-purple-100 text-purple-600"
                                                }`}
                                        >
                                            {msg.role === "user" ? (
                                                <User className="h-4 w-4" />
                                            ) : (
                                                <Bot className="h-4 w-4" />
                                            )}
                                        </div>

                                        {/* 消息气泡 - 活泼圆角+微动效 */}
                                        <div
                                            className={`rounded-2xl px-4 py-2 text-sm transition-all hover:scale-[1.02] ${msg.role === "user"
                                                ? "bg-blue-500 text-white rounded-tr-none"
                                                : "bg-white text-gray-800 shadow-sm rounded-tl-none"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* 加载中动画 */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm text-purple-600">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm">思考中...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* 底部输入框区域 - 活泼设计 */}
                    <div className="p-4 border-t border-blue-100 bg-white/80 backdrop-blur-sm rounded-b-3xl">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex gap-2"
                        >
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="输入你的问题~"
                                className="rounded-full border-blue-200 focus-visible:ring-blue-400"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || !inputValue.trim()}
                                className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </motion.div>
        )
    );
}
