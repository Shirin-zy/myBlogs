# 更新文章状态接口(发布/草稿/下架)
from fastapi import APIRouter, Depends, HTTPException
from api.deps import jwt_auth_dependency
from pydantic import BaseModel
from typing import Literal
from sqlalchemy.orm import Session
from database import get_db
from models.article import Article

router = APIRouter(tags=["article"])


class UpdateStateRequest(BaseModel):
    id: str
    state: Literal["published", "draft", "takeoff"]


@router.post("/updateStatus")
async def update_article_status(
    payload: UpdateStateRequest,
    user=Depends(jwt_auth_dependency),
    db: Session = Depends(get_db),
):
    """
    更新文章状态接口
    """
    # 1. 查找文章
    article = db.query(Article).filter(Article.id == payload.id).first()

    if article is None:
        return {"code": 404, "message": "未找到指定 ID 的文章"}

    # 2. 更新状态
    article.state = payload.state

    try:
        db.commit()
        db.refresh(article)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"数据库更新失败: {str(e)}")

    return {
        "code": 200,
        "message": "状态更新成功",
        "data": {"id": payload.id, "state": payload.state},
    }
