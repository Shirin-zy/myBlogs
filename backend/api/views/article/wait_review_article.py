from rest_framework.decorators import api_view
from rest_framework.response import Response
from utils.jwt_auth import jwt_auth_required

@api_view(['GET'])
@jwt_auth_required
def wait_review_article(request):
    """
    获取待审核文章列表接口
    通过装饰器自动校验请求头中的 Bearer Token
    """
    # 鉴权后的用户信息已由装饰器注入到 request.auth_user
    user = request.auth_user
    
    # Mock 待审核文章数据
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

    return Response({
        "code": 200,
        "status": "success",
        "message": f"用户 {user.get('username')} 获取待审核列表成功",
        "data": {
            "total": len(mock_articles),
            "list": mock_articles
        }
    })
