/**
 * 认证相关 API 服务
 *
 * 注意：登录接口的响应格式为 { status, message, data }，
 * 不走通用 http 封装（避免 code 字段校验冲突），直接使用 fetch。
 */
import { http } from "@/lib/http";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

/** 登录请求参数 */
export interface LoginPayload {
  username: string;
  password: string;
}

/** 登录响应中的用户信息 */
export interface LoginUserInfo {
  user_id: string;
  username: string;
  role: string;
}

/** 登录接口响应 */
export interface LoginResponse {
  status: "success" | "error";
  message: string;
  data: {
    token: string;
    user_info: LoginUserInfo;
  };
}

/**
 * 调用登录接口
 * POST /api/login/
 */
export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`登录请求失败：HTTP ${res.status}`);
  }

  const data: LoginResponse = await res.json();

  if (data.status !== "success") {
    throw new Error(data.message ?? "登录失败");
  }

  return data;
}

/**
 * 调用登出接口
 * POST /api/logout/
 */
export async function logoutApi() {
  await http.post("/logout");
}
