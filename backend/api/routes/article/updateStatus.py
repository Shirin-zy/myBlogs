import json
import os
from fastapi import APIRouter, Depends, Body, HTTPException
from api.deps import jwt_auth_dependency
from pydantic import BaseModel
from typing import Literal

router = APIRouter(tags=["article"])

MOCK_FILE = os.path.join("mock", "article.json")

class UpdateStateRequest(BaseModel):
    id: str
    state: Literal["published", "draft", "takeoff"]

@router.post("/updateStatus")
async def update_article_status(payload: UpdateStateRequest, user=Depends(jwt_auth_dependency)):
    """
    更新文章状态接口
    """
    # 1. 读取现有数据
    try:
        if os.path.exists(MOCK_FILE):
            with open(MOCK_FILE, "r", encoding="utf-8") as f:
                articles = json.load(f)
        else:
            return {"code": 404, "message": "文章列表为空"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"读取数据失败: {str(e)}")

    # 2. 查找并更新
    article_index = next((index for (index, d) in enumerate(articles) if d["id"] == payload.id), None)
    if article_index is None:
        return {"code": 404, "message": "未找到指定 ID 的文章"}

    articles[article_index]["state"] = payload.state

    # 3. 保存回文件
    try:
        with open(MOCK_FILE, "w", encoding="utf-8") as f:
            json.dump(articles, f, ensure_ascii=False, indent=4)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"保存数据失败: {str(e)}")

    return {
        "code": 200,
        "message": "状态更新成功",
        "data": {"id": payload.id, "state": payload.state}
    }
