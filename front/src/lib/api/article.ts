import { type HttpClient, ApiError } from "@/lib/http";

export interface ArticleItem {
  bgPicture: string;
  category: string;
  comment: number;
  created_at: string;
  id: string;
  is_new: boolean;
  tags: string[];
  title: string;
}

interface ArticleResponse {
  list: ArticleItem[];
  total: number;
}

interface ArticleBackendResponse {
  code: number;
  message: string;
  data: ArticleResponse;
}

export interface ArticleApi {
  getArticles: () => Promise<ArticleResponse>;
}

const ARTICLE_API_URL = "/blogs/articleList";

export const createArticleApi = (client: HttpClient): ArticleApi => {
  return {
    async getArticles() {
      try {
        const response =
          await client.get<ArticleBackendResponse>(ARTICLE_API_URL);
        console.log("获取文章列表成功:", response);
        if (!response.data || (response.code !== 0 && response.code !== 200)) {
          throw new ApiError({
            status: 500,
            message: response.message || "Failed to load articles",
            code: String(response.code),
            details: response,
          });
        }
        return response.data;
      } catch (error) {
        console.error("获取文章列表失败:", error);
        throw error;
      }
    },
  };
};
