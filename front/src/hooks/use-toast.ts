'use client'

import { useState, useCallback } from 'react'

/** Toast 通知类型 */
interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

type ToastInput = Omit<Toast, 'id'>

/** 全局 Toast 状态 */
let toastState: Toast[] = []
let listeners: Array<(toasts: Toast[]) => void> = []

function notify(toasts: Toast[]) {
  toastState = toasts
  listeners.forEach((l) => l(toasts))
}

/**
 * useToast Hook
 * 提供全局 Toast 通知能力，遵循 Shadcn UI 规范
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(toastState)

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  // 订阅全局状态变更
  useState(() => {
    const unsub = subscribe(setToasts)
    return unsub
  })

  const toast = useCallback((input: ToastInput) => {
    const id = Math.random().toString(36).slice(2)
    const newToast: Toast = { id, duration: 5000, ...input }
    const next = [...toastState, newToast]
    notify(next)

    // 自动移除
    setTimeout(() => {
      notify(toastState.filter((t) => t.id !== id))
    }, newToast.duration)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    notify(toastState.filter((t) => t.id !== id))
  }, [])

  return { toasts, toast, dismiss }
}
