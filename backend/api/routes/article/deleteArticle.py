# 删除文章
from fastapi import APIRouter, Depends, HTTPException, Body
from api.deps import jwt_auth_dependency
from sqlalchemy.orm import Session
from database import get_db
from models.article import Article

router = APIRouter(tags=["article"])


@router.post("/delete")
async def delete_article(
    id: str = Body(..., embed=True),
    user=Depends(jwt_auth_dependency),
    db: Session = Depends(get_db),
):
    """
    删除文章接口
    需要鉴权，接收 id 参数
    """
    # 1. 查找文章
    article = db.query(Article).filter(Article.id == id).first()

    if not article:
        return {"code": 404, "message": f"未找到 ID 为 {id} 的文章"}

    # 2. 删除
    try:
        db.delete(article)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"数据库删除失败: {str(e)}")

    return {"code": 200, "message": "文章删除成功", "data": {"id": id}}
