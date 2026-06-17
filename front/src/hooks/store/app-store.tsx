"use client"

import { createStore, type StoreApi, useStore } from "zustand"
import { createContext, useContext, useRef, type ReactNode } from "react"
import { loginApi, logoutApi, sendVerificationCodeApi } from "@/lib/api/auth-service"

const STORAGE_KEY = "app-store-state"

interface userinfo{
  user_id: string
  username: string
  nickname: string
  role: string
  email?: string
  avatar?: string
}
interface AppStoreState {
  user: userinfo | null
  isLogin: boolean
}

interface AppStoreAction {
  loginWithPassword: (email: string, password: string) => void
  loginWithCode: (email: string, verifyCode: string) => void
  sendVerificationCode: (email: string) => void
  logout: () => void
}

type AppStore = AppStoreState & AppStoreAction

// 从 localStorage 恢复状态
const getInitialState = (): Partial<AppStoreState> => {
  if (typeof window === "undefined") return { user: null, isLogin: false }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error("Failed to load state from localStorage:", e)
  }
  return { user: null, isLogin: false }
}

// 保存状态到 localStorage
const saveState = (state: AppStoreState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user, isLogin: state.isLogin }))
  } catch (e) {
    console.error("Failed to save state to localStorage:", e)
  }
}

// 清除 localStorage 中的状态
const clearState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error("Failed to clear state from localStorage:", e)
  }
}

/**
 * 管理员认证状态 Store
 * Token 存储在 Cookie（由服务端种入），middleware 通过读取同名 Cookie 判断登录态。
 * 用户信息持久化到 localStorage（非敏感信息）。
 */

const createAppStore = (): StoreApi<AppStore> => {
  const initialState = getInitialState()
  return createStore<AppStore>()((set, get) => ({
    user: initialState.user ?? null,
    isLogin: initialState.isLogin ?? false,
    loginWithPassword: async (email: string, password: string) => {
      try {
        const res = await loginApi({ email, password })
        const { user_info } = res.data
        const newState = { user: user_info, isLogin: true }
        set(newState)
        saveState(newState)
      } catch (error) {
        set({ isLogin: false })
        throw error
      }
    },
    loginWithCode: async (email: string, verifyCode: string) => {
      try {
        const res = await loginApi({ email, verifyCode })
        const { user_info } = res.data
        const newState = { user: user_info, isLogin: true }
        set(newState)
        saveState(newState)
      } catch (error) {
        set({ isLogin: false })
        throw error
      }
    },
    sendVerificationCode: async (email: string) => {
      try {
        await sendVerificationCodeApi({ email })
      } catch (error) {
        throw error
      }
    },
    logout: async () => {
      try {
        await logoutApi()
        set({ user: null, isLogin: false })
        clearState()
      } catch (error) {
        throw error
      }
    },
  }))
}

const AppStoreContext = createContext<StoreApi<AppStore> | null>(null)

// 提供 AppStore 上下文的组件
export const AppStoreProvider = ({ children }: { children: ReactNode }) => {
  // Store 只创建一次，避免热更新或重复渲染时重新初始化。
  const storeRef = useRef<StoreApi<AppStore>>(null)
  if (!storeRef.current) {
    storeRef.current = createAppStore()
  }
  return <AppStoreContext.Provider value={storeRef.current}>{children}</AppStoreContext.Provider>
}

const useAppStoreContext = (): StoreApi<AppStore> => {
  const store = useContext(AppStoreContext)
  if (!store) {
    throw new Error("useAppStore must be used within AppStoreProvider")
  }
  return store
}

// 自定义 Hook，用于在组件中使用 AppStore
export const useAppStore = <T,>(selector: (state: AppStore) => T): T => {
  const store = useAppStoreContext()
  return useStore(store, selector)
}

export const useAppStoreActions = () => {
  const store = useAppStoreContext()
  const { loginWithPassword, loginWithCode, sendVerificationCode, logout } = store.getState()
  return {
    loginWithPassword,
    loginWithCode,
    sendVerificationCode,
    logout,
  }
}
