# 获取已发布文章列表
from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.article import Article

router = APIRouter(tags=["article"])


@router.get("/blogs/articleList")
async def article_list(request: Request, db: Session = Depends(get_db)):
    """
    获取已发布文章列表接口
    从数据库读取数据
    """
    try:
        # 过滤 state 为 published 的项
        db_articles = db.query(Article).filter(Article.state == "published").all()

        filtered_articles = []
        for article in db_articles:
            # 转换为字典并排除 state 和 content 字段
            article_data = article.to_dict()
            article_data.pop("state", None)
            article_data.pop("content", None)
            filtered_articles.append(article_data)

        return {
            "code": 200,
            "message": "获取已发布文章列表成功",
            "data": {"total": len(filtered_articles), "list": filtered_articles},
        }
    except Exception as e:
        return {
            "code": 500,
            "message": f"获取文章列表失败: {str(e)}",
            "data": {"total": 0, "list": []},
        }
