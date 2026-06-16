# 获取文章详情
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.article import Article
from utils.text_utils import count_readable_words

router = APIRouter(tags=["article"])


@router.get("/articleDetail")
async def get_article_detail(id: str, db: Session = Depends(get_db)):
    """
    获取文章详情接口
    不需要鉴权，根据 id 返回文章项
    每次访问会自动增加 views 访问量
    """
    # 查找对应 ID 的文章
    article = db.query(Article).filter(Article.id == id).first()

    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")

    # 增加 views 访问量
    article.views = article.views + 1
    try:
        db.commit()
        db.refresh(article)
    except Exception as e:
        db.rollback()

    data = article.to_dict()
    data["word_count"] = count_readable_words(article.content)

    return {"code": 200, "message": "获取文章详情成功", "data": data}
