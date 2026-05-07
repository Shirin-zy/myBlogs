import os
import json
from fastapi import APIRouter, Request, Depends
from api.deps import jwt_auth_dependency

router = APIRouter(tags=["article"])

MOCK_FILE = os.path.join("mock", "article.json")

@router.get("/dashboard/allArticle")
async def all_article(request: Request, user=Depends(jwt_auth_dependency)):
    try:
        if os.path.exists(MOCK_FILE):
            with open(MOCK_FILE, "r", encoding="utf-8") as f:
                mock_articles = json.load(f)
        else:
            mock_articles = []
    except Exception as e:
        mock_articles = []
    
    articles = []
    for article in mock_articles:
        item = article.copy()
        item.pop("content", None)
        articles.append(item)
    
    return {
        "code": 200,
        "status": "success",
        "message": f"用户 {user.get('username')} 获取待审核列表成功",
        "data": {
            "total": len(articles),
            "list": articles
        }
    }
