# 保存文章接口
import uuid
from fastapi import APIRouter, Depends
from api.deps import jwt_auth_dependency
from api.schemas.article import ArticleSaveRequest
from sqlalchemy.orm import Session
from database import get_db
from models.article import Article

router = APIRouter(tags=["article"])


@router.post("/save")
async def save_article(
    request_data: ArticleSaveRequest,
    user=Depends(jwt_auth_dependency),
    db: Session = Depends(get_db),
):
    """
    保存文章接口
    如果携带 id 则更新文章，否则创建新文章
    数据将持久化到数据库
    """
    if request_data.id:
        # 更新逻辑
        article = db.query(Article).filter(Article.id == request_data.id).first()
        if article is None:
            return {"code": 404, "message": "未找到指定 ID 的文章，无法更新"}

        # 更新字段
        article.title = request_data.title
        article.content = request_data.content
        article.tags = request_data.tags
        article.category = request_data.category
        article.bgPicture = request_data.bgPicture

        if request_data.state:
            article.state = request_data.state

        result_article = article
    else:
        # 新增逻辑
        new_article = Article(
            id=str(uuid.uuid4())[:8],  # 简单生成一个 8 位 ID
            title=request_data.title,
            content=request_data.content,
            tags=request_data.tags,
            category=request_data.category,
            is_new=True,
            bgPicture=request_data.bgPicture,
            state="draft",
            comment=0,
            author=user.get("username"),
        )
        db.add(new_article)
        result_article = new_article

    # 保存到数据库
    try:
        db.commit()
        db.refresh(result_article)
    except Exception as e:
        db.rollback()
        return {"code": 500, "message": f"保存失败: {str(e)}"}

    return {
        "code": 200,
        "message": "文章保存成功" if not request_data.id else "文章更新成功",
        "data": result_article.to_dict(),
    }
