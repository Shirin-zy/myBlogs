# 文章时间线归档统计接口

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.article import Article

router = APIRouter(tags=["article"])


@router.get("/archive")
async def get_article_archive(db: Session = Depends(get_db)):
    """
    获取文章归档统计接口
    返回按时间排序的已发布文章简要信息
    """
    # 1. 查询所有已发布的文章，按创建时间降序排序
    articles = (
        db.query(Article)
        .filter(Article.state == "published")
        .order_by(Article.created_at.desc())
        .all()
    )

    archive_list = []
    for article in articles:
        # 2. 格式化数据
        # year 要求格式为 "YY-MM-DD"
        year_str = article.created_at.strftime("%y-%m-%d") if article.created_at else ""

        # desc 使用 tags，这里将 tags 数组转为字符串
        desc_str = (
            ", ".join(article.tags)
            if article.tags and isinstance(article.tags, list)
            else ""
        )

        archive_list.append(
            {
                "id": article.id,
                "year": year_str,
                "title": article.title,
                "desc": desc_str,
                "imgUrl": article.bgPicture,
            }
        )

    return {"code": 200, "message": "获取文章归档成功", "data": archive_list}
