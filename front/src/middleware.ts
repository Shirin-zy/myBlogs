import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

/** 需要管理员登录才能访问的路由前缀 */
const ADMIN_ROUTES: string[] = ['/dashboard', '/posts', '/audit', '/settings']

/** 仅未登录用户可访问的路由（登录后跳转到后台） */
const AUTH_ROUTES = ['/login']

/** JWT 密钥 */
const SECRET_KEY = new TextEncoder().encode('django-insecure-1d6jk2p8mvxu-w8pd5k#jgwbsq-o)nwa9#p1v(9w4ro2clfhoi')

/**
 * 验证并解密 JWT Token
 */
async function verifyJWT(token: string): Promise<{ role?: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    })
    return payload as { role?: string }
  } catch (error) {
    return null
  }
}

/**
 * Next.js 中间件
 * 路由级鉴权守卫：
 * - 未登录用户访问 ADMIN_ROUTES → 跳转至 /login
 * - role为user的用户访问ADMIN_ROUTES → 跳转至 /home
 * - 已登录用户访问 AUTH_ROUTES → 跳转至 /dashboard
 * - (home) 路由组的公开页面不受限制
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 获取 JWT Token
  const authCookie = request.cookies.get('blog-session')?.value
  const hasAuthCookie = !!authCookie

  // 验证并获取用户角色
  let userRole: string | undefined
  if (hasAuthCookie) {
    const payload = await verifyJWT(authCookie)
    userRole = payload?.role
  }

  // 访问管理后台
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r))
  if (isAdminRoute) {
    // 未登录 → 跳转登录页
    if (!hasAuthCookie) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    // 已登录但角色不是admin → 跳转/home
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/home', request.url))
    }
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
