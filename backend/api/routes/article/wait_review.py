from fastapi import APIRouter, Request, Depends
from api.deps import jwt_auth_dependency

router = APIRouter(tags=["article"])

@router.get("/waitReviewArticle")
async def wait_review_article(request: Request, user=Depends(jwt_auth_dependency)):
    mock_articles = [
        {
            "id": 101,
            "title": "Django REST Framework 进阶指南",
            "author": "张三",
            "created_at": "2024-04-20 10:00:00",
            "status": "pending_review"
        },
        {
            "id": 102,
            "title": "前端框架性能优化实践",
            "author": "李四",
            "created_at": "2024-04-20 11:30:00",
            "status": "pending_review"
        },
        {
            "id": 103,
            "title": "深入理解 JWT 鉴权机制",
            "author": "王五",
            "created_at": "2024-04-20 14:15:00",
            "status": "pending_review"
        }
    ]
    return {
        "code": 200,
        "status": "success",
        "message": f"用户 {user.get('username')} 获取待审核列表成功",
        "data": {
            "total": len(mock_articles),
            "list": mock_articles
        }
    }
