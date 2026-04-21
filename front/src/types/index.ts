/** API 基础类型定义 */

// ── 通用 ─────────────────────────────────────────────────────

/** 通用分页参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 通用分页响应 */
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 通用 API 响应 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// ── 用户 / 认证 ───────────────────────────────────────────────

/** 管理员角色（仅管理员可登录后台） */
export type AdminRole = 'admin'

/** 管理员用户 */
export interface AdminUser {
  id: string
  username: string
  nickname: string
  avatar?: string
  role: AdminRole
  email?: string
}

// ── 文章 ──────────────────────────────────────────────────────

/** 文章发布状态 */
export type PostStatus = 'published' | 'draft'

/** 文章摘要（列表展示） */
export interface PostSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  coverUrl?: string
  category: string
  tags: string[]
  status: PostStatus
  viewCount: number
  commentCount: number
  publishedAt: string
  updatedAt: string
}

/** 文章详情（含正文） */
export interface PostDetail extends PostSummary {
  content: string
  readingTime: number // 分钟
}

// ── 分类 / 标签 ───────────────────────────────────────────────

/** 分类 */
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  postCount: number
}

/** 标签 */
export interface Tag {
  id: string
  name: string
  slug: string
  postCount: number
}

// ── 评论 ──────────────────────────────────────────────────────

/** 评论审核状态 */
export type CommentStatus = 'pending' | 'approved' | 'rejected'

/** 评论 */
export interface Comment {
  id: string
  postId: string
  postTitle: string
  author: string
  email?: string
  content: string
  status: CommentStatus
  replyTo?: string
  ip: string
  createdAt: string
}

// ── 数据工作台 ────────────────────────────────────────────────

/** 博客核心指标 */
export interface BlogStats {
  totalPosts: number
  totalComments: number
  totalCategories: number
  totalTags: number
  todayPV: number
  todayUV: number
  pendingComments: number
}

/** 访问趋势数据点 */
export interface VisitTrendPoint {
  date: string
  pv: number
  uv: number
}

/** 热门文章 */
export interface HotPost {
  id: string
  title: string
  slug: string
  viewCount: number
  commentCount: number
}
