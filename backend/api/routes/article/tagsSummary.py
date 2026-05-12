# 个标签下文章数统计接口

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.article import Article
from collections import Counter
import datetime

router = APIRouter(tags=["article"])

_cache = {"data": None, "timestamp": None}
CACHE_TTL_SECONDS = 10 * 60


def get_cached_tag_stats():
    now = datetime.datetime.utcnow()
    if _cache["data"] is not None and _cache["timestamp"] is not None:
        if (now - _cache["timestamp"]).total_seconds() < CACHE_TTL_SECONDS:
            return _cache["data"]
    return None


def set_cached_tag_stats(data):
    _cache["data"] = data
    _cache["timestamp"] = datetime.datetime.utcnow()


@router.get("/tagSummary")
async def tag_summary(db: Session = Depends(get_db)):
    cached = get_cached_tag_stats()
    if cached is not None:
        return {"code": 200, "message": "获取标签统计成功", "data": cached}

    try:
        db_articles = (
            db.query(Article)
            .filter(Article.state == "published", Article.tags.isnot(None))
            .all()
        )

        tag_counter = Counter()
        for article in db_articles:
            if article.tags and isinstance(article.tags, list):
                tag_counter.update(article.tags)

        result = [
            {"name": tag, "count": count} for tag, count in tag_counter.most_common()
        ]

        set_cached_tag_stats(result)

        return {"code": 200, "message": "获取标签统计成功", "data": result}
    except Exception as e:
        return {"code": 500, "message": f"获取标签统计失败: {str(e)}", "data": []}
