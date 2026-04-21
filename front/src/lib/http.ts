import type { ApiResponse } from "@/types";

/** API 基础路径 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

/** HTTP 请求方法类型 */
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/** 请求配置 */
interface RequestConfig extends RequestInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
}

/**
 * 构建 URL 查询参数
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildQueryString(params: Record<string, any>): string {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join("&");
  return query ? `?${query}` : "";
}

/**
 * 基础 HTTP 请求封装
 * 自动携带 Token、处理错误、格式化响应
 */
async function request<T>(
  method: HttpMethod,
  path: string,
  config: RequestConfig = {},
): Promise<T> {
  const { params, ...rest } = config;
  const queryString = params ? buildQueryString(params) : "";
  const url = `${API_BASE_URL}${path}${queryString}`;

  // 从 Cookie 或 store 中获取 token
  // 注意：敏感 token 不存入 localStorage，使用 httpOnly Cookie
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...rest.headers,
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      credentials: "include", // 自动携带 Cookie
      ...rest,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token 过期，跳转登录
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data: ApiResponse<T> = await response.json();

    if (data.code !== 0 && data.code !== 200) {
      throw new Error(data.message ?? "请求失败");
    }

    return data.data;
  } catch (error) {
    console.error(`[API] ${method} ${path} failed:`, error);
    throw error;
  }
}

/** HTTP 请求工具 */
export const http = {
  get: <T>(path: string, config?: RequestConfig) =>
    request<T>("GET", path, config),
  post: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>("POST", path, { ...config, body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>("PUT", path, { ...config, body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>("PATCH", path, { ...config, body: JSON.stringify(body) }),
  delete: <T>(path: string, config?: RequestConfig) =>
    request<T>("DELETE", path, config),
};
