import json
import os
from fastapi import APIRouter, Request, Depends
from api.deps import jwt_auth_dependency

router = APIRouter(tags=["article"])

MOCK_FILE = os.path.join("mock", "article.json")

@router.get("/blogs/articleList")
async def article_list(request: Request, user=Depends(jwt_auth_dependency)):
    """
    获取文章列表接口
    从 mock/article.json 读取数据
    """
    try:
        if os.path.exists(MOCK_FILE):
            with open(MOCK_FILE, "r", encoding="utf-8") as f:
                mock_articles = json.load(f)
        else:
            mock_articles = []
    except Exception as e:
        mock_articles = []

    # 过滤 published 为 True 的项，并排除 published 和 content 字段
    filtered_articles = []
    for article in mock_articles:
        if article.get("state") == "published":
            # 创建副本并删除不需要的字段
            article_data = article.copy()
            article_data.pop("state", None)
            article_data.pop("content", None)
            filtered_articles.append(article_data)

    return {
        "code": 200,
        "message": f"用户 {user.get('username')} 获取文章列表成功",
        "data": {
            "total": len(filtered_articles),
            "list": filtered_articles
        }
    }
