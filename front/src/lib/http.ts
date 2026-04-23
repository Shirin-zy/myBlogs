/** API 基础路径 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

/** HTTP 请求方法类型 */
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiErrorShape {
  status: number;
  code?: string;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(shape: ApiErrorShape) {
    super(shape.message);
    this.name = "ApiError";
    this.status = shape.status;
    this.code = shape.code;
    this.details = shape.details;
  }
}

/** 请求配置 */
export interface RequestConfig extends RequestInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
}

/** HTTP 客户端接口定义 */
// export interface HttpClient {
//   get<T>(path: string, config?: RequestConfig): Promise<T>;
//   post<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T>;
//   put<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T>;
//   patch<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T>;
//   delete<T>(path: string, config?: RequestConfig): Promise<T>;
// }

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
 * 自动携带 Token、处理错误、返回后端响应结构
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

    // 按照用户需求，直接返回后端原始响应数据结构 T
    const data: T = await response.json();
    return data;
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

/** HTTP 客户端类型定义 */
export type HttpClient = typeof http;
