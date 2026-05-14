import { type HttpClient, ApiError } from "@/lib/http"

export interface Website {
  id: number | string
  categoryId: string
  name: string
  desc: string
  url: string
  iconUrl: string
}
export interface ToolsetsBackendResponse {
  code: number
  message: string
  data: Website[]
}

export interface overview {
  month: string
  year: string
  count: number
}

export interface ResponsesiteInfo {
  monthly_stats: overview[]
  total_articles: number
  total_words: number
}

export interface SiteInfoBackendResponse {
  code: number
  message: string
  data: ResponsesiteInfo
}

export interface OthersApi {
  getToolsets: (params?: { categoryId?: string }) => Promise<Website[]>
  getSiteInfo: () => Promise<ResponsesiteInfo>
}

const PUBLISHED_ARTICLE_API_URL = "/toolset"
const SITE_INFO_API_URL = "/overview"

export const createOthersApi = (client: HttpClient): OthersApi => {
  return {
    async getToolsets(params?: { categoryId?: string }) {
      try {
        const response = await client.get<ToolsetsBackendResponse>(PUBLISHED_ARTICLE_API_URL, { params })
        if (!response.data || (response.code !== 0 && response.code !== 200)) {
          throw new ApiError({
            status: 500,
            message: response.message || "Failed to load toolsets",
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
    async getSiteInfo() {
      try {
        const response = await client.get<SiteInfoBackendResponse>(SITE_INFO_API_URL)
        if (!response.data || (response.code !== 0 && response.code !== 200)) {
          throw new ApiError({
            status: 500,
            message: response.message || "Failed to load toolsets",
            code: String(response.code),
            details: response,
          })
        }
        return response.data
      } catch (error) {
        throw new ApiError({
          status: 500,
          message: "Failed to load site info",
          code: String(500),
          details: error,
        })
      }
    },
  }
}
