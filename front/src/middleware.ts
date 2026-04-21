import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** 需要管理员登录才能访问的路由前缀 */
const ADMIN_ROUTES: string[] = ['/dashboard', '/posts', '/audit', '/settings']

/** 仅未登录用户可访问的路由（登录后跳转到后台） */
const AUTH_ROUTES = ['/login']

/**
 * Next.js 中间件
 * 路由级鉴权守卫：
 * - 未登录用户访问 ADMIN_ROUTES → 跳转至 /login
 * - 已登录用户访问 AUTH_ROUTES → 跳转至 /dashboard
 * - (home) 路由组的公开页面不受限制
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 通过 Cookie 判断登录状态（Cookie 由服务端在登录时种入）
  const hasAuthCookie = request.cookies.has('blog-session')

  // 访问管理后台但未登录 → 跳转至登录页
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r))
  if (isAdminRoute && !hasAuthCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 已登录用户访问登录页 → 跳转至管理后台
  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  if (isAuthRoute && hasAuthCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，排除：
     * - _next/static、_next/image（Next.js 内部资源）
     * - favicon.ico、静态图片
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
