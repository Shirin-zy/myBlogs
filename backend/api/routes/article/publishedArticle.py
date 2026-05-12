# 已发布文章列表接口

from fastapi import APIRouter, Request, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.article import Article
from typing import Optional

router = APIRouter(tags=["article"])


@router.get("/blogs/articleList")
async def article_list(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(6, ge=1),
    tag: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    获取已发布文章列表接口
    支持分页、按标签过滤、按分类过滤
    """
    try:
        # 1. 基础查询：必须是已发布的文章，按创建时间降序排序
        query = db.query(Article).filter(Article.state == "published")

        # 2. 标签过滤 (JSON 包含判断)
        if tag:
            # 使用 MySQL 的 JSON_CONTAINS 函数
            query = query.filter(func.json_contains(Article.tags, func.json_quote(tag)))

        # 3. 分类过滤
        if category:
            query = query.filter(Article.category == category)

        # 4. 获取总数 (应用过滤后，分页前)
        total = query.count()

        # 5. 分页与排序
        db_articles = (
            query.order_by(Article.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        # 6. 数据转换
        list_data = []
        for article in db_articles:
            article_data = article.to_dict()
            article_data.pop("state", None)
            article_data.pop("content", None)
            list_data.append(article_data)

        return {
            "code": 200,
            "message": "获取文章列表成功",
            "data": {"total": total, "list": list_data, "page": page, "limit": limit},
        }
    except Exception as e:
        return {
            "code": 500,
            "message": f"获取文章列表失败: {str(e)}",
            "data": {"total": 0, "list": [], "page": page, "limit": limit},
        }
