'use client'

import { createStore, type StoreApi, useStore } from "zustand";
import { createContext, useContext, useRef, type ReactNode } from "react";
import Cookies from "js-cookie";
import type { AdminUser } from "@/types";
import { loginApi } from "@/lib/api/auth-service";

/** Token Cookie 名称（与 middleware 保持一致） */
const SESSION_COOKIE = "blog-session";

/** Token 有效期（天） */
const TOKEN_EXPIRES_DAYS = 7;

interface AppStoreState {
  user: string | null;
  isLogin: boolean;
}

interface AppStoreAction {
  login: (username: string, password: string) => void;
  logout: () => void;
}

type AppStore = AppStoreState & AppStoreAction;

/**
 * 管理员认证状态 Store
 * Token 存储在 js-cookie（非 HttpOnly），middleware 通过读取同名 Cookie 判断登录态。
 * 用户信息持久化到 localStorage（非敏感信息）。
 */

const createAppStore = (): StoreApi<AppStore> =>
  createStore<AppStore>()((set, get) => ({
    user: null,
    isLogin: false,
    login: async (username: string, password: string) => {
      try {
        const res = await loginApi({ username, password });
        const { token, user_info } = res.data;

        // 将 token 存入 Cookie，供 middleware 路由守卫读取
        Cookies.set(SESSION_COOKIE, token, {
          expires: TOKEN_EXPIRES_DAYS,
          sameSite: "strict",
        });
        set({ user: user_info.user_id, isLogin: true });
      } catch (error) {
        set({ isLogin: false });
        throw error;
      }
    },
    logout: () => {
      // 清除 Cookie 和本地状态
      Cookies.remove(SESSION_COOKIE);
      set({ user: null, isLogin: false });
    },
  }));

const AppStoreContext = createContext<StoreApi<AppStore> | null>(null);

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
  const {
    login,
    logout,
  } = store.getState()
  return {
    login,
    logout,
  }
}