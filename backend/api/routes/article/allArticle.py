# 获取所有文章
from fastapi import APIRouter, Request, Depends
from api.deps import jwt_auth_dependency
from sqlalchemy.orm import Session
from database import get_db
from models.article import Article

router = APIRouter(tags=["article"])


@router.get("/dashboard/allArticle")
async def all_article(
    request: Request, user=Depends(jwt_auth_dependency), db: Session = Depends(get_db)
):
    """
    获取所有文章接口
    返回所有文章的简要信息
    """
    try:
        # 从数据库获取所有文章
        db_articles = db.query(Article).all()

        articles = []
        for article in db_articles:
            # 转换为字典并移除内容（列表页通常不需要全文）
            item = article.to_dict()
            item.pop("content", None)
            articles.append(item)

        return {
            "code": 200,
            "message": f"用户 {user.get('username')} 获取待审核列表成功",
            "data": {"total": len(articles), "list": articles},
        }
    except Exception as e:
        return {
            "code": 500,
            "message": f"获取文章列表失败: {str(e)}",
            "data": {"total": 0, "list": []},
        }
