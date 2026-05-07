import json
import os
import datetime
import uuid
from fastapi import APIRouter, Depends, Request
from api.deps import jwt_auth_dependency
from api.schemas.article import ArticleSaveRequest

router = APIRouter(tags=["article"])

MOCK_FILE = os.path.join("mock", "article.json")

@router.post("/save")
async def save_article(request_data: ArticleSaveRequest, user=Depends(jwt_auth_dependency)):
    """
    保存文章接口
    数据将持久化到 mock/article.json
    """
    # 1. 读取现有数据
    try:
        if os.path.exists(MOCK_FILE):
            with open(MOCK_FILE, "r", encoding="utf-8") as f:
                articles = json.load(f)
        else:
            articles = []
    except Exception:
        articles = []

    # 2. 构造新文章对象
    new_article = {
        "id": str(uuid.uuid4())[:8],  # 简单生成一个 8 位 ID
        "title": request_data.title,
        "content": request_data.content,
        "created_at": datetime.datetime.now().strftime("%Y-%m-%d"),
        "tags": request_data.tags,
        "category": request_data.category,
        "is_new": True,
        "bgPicture": request_data.bgPicture,
        "published": request_data.published,
        "comment": 0,
        "author": user.get("username")
    }

    # 3. 追加并保存
    articles.insert(0, new_article)  # 插入到开头，方便展示最新文章
    
    try:
        with open(MOCK_FILE, "w", encoding="utf-8") as f:
            json.dump(articles, f, ensure_ascii=False, indent=4)
    except Exception as e:
        return {"code": 500, "message": f"保存失败: {str(e)}"}

    return {
        "code": 200,
        "message": "文章保存成功",
        "data": new_article
    }
