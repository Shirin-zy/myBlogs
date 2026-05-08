import { type HttpClient, ApiError } from "@/lib/http"

export interface ArticleItem {
  bgPicture: string
  category: string
  comment: number
  created_at: string
  id: string
  is_new: boolean
  tags: string[]
  title: string
  state?: "published" | "draft" | "takeoff"
}

interface ArticleResponse {
  list: ArticleItem[]
  total: number
}

interface ArticleBackendResponse {
  code: number
  message: string
  data: ArticleResponse
}

interface saveArticlePayload {
  id?: string
  title: string
  content: string
  tags: string[]
  category: string
  bgPicture: string
}

interface saveArticleResponse {
  code: number
  message: string
}

interface articleDetailBackendResponse {
  code: number
  message: string
  data: ArticleItem & { content: string }
}

interface deleteArticleBackendResponse {
  code: number
  message: string
  data: { id: string }
}
export interface ArticleApi {
  getArticles: () => Promise<ArticleResponse>
  getAllArticles: () => Promise<ArticleResponse>
  saveArticle: (payload: saveArticlePayload) => Promise<saveArticleResponse>
  getArticleDetail: (id: string) => Promise<ArticleItem & { content: string }>
  deleteArticle: (id: string) => Promise<void>
  updateArticleState: (id: string, state: "published" | "draft" | "takeoff") => Promise<void>
}

const PUBLISHED_ARTICLE_API_URL = "/blogs/articleList"
const ALL_ARTICLE_API_URL = "/dashboard/allArticle"
const SAVE_ARTICLE_API_URL = "/save"
const DELETE_ARTICLE_API_URL = "/delete"
const ARTICLE_DETAIL_API_URL = "/articleDetail"
const UPDATE_ARTICLE_STATUS_API_URL = "/updateStatus"

export const createArticleApi = (client: HttpClient): ArticleApi => {
  return {
    async getArticles() {
      try {
        const response = await client.get<ArticleBackendResponse>(PUBLISHED_ARTICLE_API_URL)
        console.log("获取文章列表成功:", response)
        if (!response.data || (response.code !== 0 && response.code !== 200)) {
          throw new ApiError({
            status: 500,
            message: response.message || "Failed to load articles",
            code: String(response.code),
            details: response,
          })
        }
        return response.data
      } catch (error) {
        throw new ApiError({
          status: 500,
          message: "Failed to load articles",
          code: String(500),
          details: error,
        })
      }
    },
    async getAllArticles() {
      try {
        const response = await client.get<ArticleBackendResponse>(ALL_ARTICLE_API_URL)
        if (!response.data || (response.code !== 0 && response.code !== 200)) {
          throw new ApiError({
            status: 500,
            message: response.message || "Failed to load articles",
            code: String(response.code),
            details: response,
          })
        }
        return response.data
      } catch (error) {
        throw new ApiError({
          status: 500,
          message: "Failed to load articles",
          code: String(500),
          details: error,
        })
      }
    },
    async saveArticle(payload: saveArticlePayload) {
      try {
        const response = await client.post<saveArticleResponse>(SAVE_ARTICLE_API_URL, payload)
        if (response.code !== 0 && response.code !== 200) {
          throw new ApiError({
            status: 500,
            message: response.message || "Failed to save article",
            code: String(response.code),
            details: response,
          })
        }
        return response
      } catch (error) {
        throw new ApiError({
          status: 500,
          message: "Failed to load articles",
          code: String(500),
          details: error,
        })
      }
    },
    async getArticleDetail(id) {
      try {
        const response = await client.get<articleDetailBackendResponse>(`${ARTICLE_DETAIL_API_URL}?id=${id}`)
        if (!response.data || (response.code !== 0 && response.code !== 200)) {
          throw new ApiError({
            status: 500,
            message: response.message || "Failed to load article detail",
            code: String(response.code),
            details: response,
          })
        }
        return response.data
      } catch (error) {
        throw new ApiError({
          status: 500,
          message: "Failed to load article detail",
          code: String(500),
          details: error,
        })
      }
    },
    async deleteArticle(id: string) {
      try {
        const response = await client.post<deleteArticleBackendResponse>(DELETE_ARTICLE_API_URL, { id })
        if (response.code !== 0 && response.code !== 200) {
          throw new ApiError({
            status: 500,
            message: response.message || "Failed to delete article",
            code: String(response.code),
            details: response,
          })
        }
      } catch (error) {
        throw new ApiError({
          status: 500,
          message: "Failed to delete article",
          code: String(500),
          details: error,
        })
      }
    },
    async updateArticleState(id, state) {
      try {
        const response = await client.post<any>(UPDATE_ARTICLE_STATUS_API_URL, { id, state })
        if (response.code !== 0 && response.code !== 200) {
          throw new ApiError({
            status: 500,
            message: response.message || "Failed to update article status",
            code: String(response.code),
            details: response,
          })
        }
      } catch (error) {
        throw new ApiError({
          status: 500,
          message: "Failed to update article status",
          code: String(500),
          details: error,
        })
      }
    },
  }
}
