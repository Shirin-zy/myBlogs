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
    如果携带 id 则更新文章，否则创建新文章
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

    # 2. 判断是更新还是新增
    if request_data.id:
        # 更新逻辑
        article_index = next((index for (index, d) in enumerate(articles) if d["id"] == request_data.id), None)
        if article_index is None:
            return {"code": 404, "message": "未找到指定 ID 的文章，无法更新"}
        
        # 更新字段
        target_article = articles[article_index]
        target_article.update({
            "title": request_data.title,
            "content": request_data.content,
            "tags": request_data.tags,
            "category": request_data.category,
            "bgPicture": request_data.bgPicture,
            "updated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        if request_data.state:
            target_article["state"] = request_data.state
        
        # 如果 request_data 中有状态字段，也可以更新，这里保持原状或根据业务逻辑调整
        result_article = target_article
    else:
        # 新增逻辑
        new_article = {
            "id": str(uuid.uuid4())[:8],  # 简单生成一个 8 位 ID
            "title": request_data.title,
            "content": request_data.content,
            "created_at": datetime.datetime.now().strftime("%Y-%m-%d"),
            "tags": request_data.tags,
            "category": request_data.category,
            "is_new": True,
            "bgPicture": request_data.bgPicture,
            "state": "takeoff",
            "comment": 0,
            "author": user.get("username")
        }
        articles.insert(0, new_article)  # 插入到开头
        result_article = new_article

    # 3. 保存到文件
    try:
        with open(MOCK_FILE, "w", encoding="utf-8") as f:
            json.dump(articles, f, ensure_ascii=False, indent=4)
    except Exception as e:
        return {"code": 500, "message": f"保存失败: {str(e)}"}

    return {
        "code": 200,
        "message": "文章保存成功" if not request_data.id else "文章更新成功",
        "data": result_article
    }
