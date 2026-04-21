'use client'

import { useState, useCallback, useRef } from 'react'

/**
 * useDebounce Hook
 * 对回调函数应用防抖，适用于搜索输入等高频触发场景
 *
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（ms），默认 300ms
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number = 300
): T {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => fn(...args), delay)
    },
    [fn, delay]
  ) as T
}

/**
 * useDebouncedValue Hook
 * 对值应用防抖，返回防抖后的值
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  if (value !== debouncedValue) {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay)
  }

  return debouncedValue
}
