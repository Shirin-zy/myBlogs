import json
import os
from fastapi import APIRouter, HTTPException

router = APIRouter(tags=["article"])

MOCK_FILE = os.path.join("mock", "article.json")

@router.get("/articleDetail")
async def get_article_detail(id: str):
    """
    获取文章详情接口
    不需要鉴权，根据 id 返回文章项
    """
    try:
        if os.path.exists(MOCK_FILE):
            with open(MOCK_FILE, "r", encoding="utf-8") as f:
                articles = json.load(f)
        else:
            articles = []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"读取数据失败: {str(e)}")

    # 查找对应 ID 的文章
    article = next((item for item in articles if item["id"] == id), None)

    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")

    return {
        "code": 200,
        "message": "获取文章详情成功",
        "data": article
    }
