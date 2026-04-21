from rest_framework.decorators import api_view
from rest_framework.response import Response
from utils.jwt_auth import jwt_auth_required


@api_view(["POST"])
@jwt_auth_required
def logout(request):
    """
    POST 方法登出接口
    清除 Cookie 中的 blog-session 从而使 Token 失效
    """
    response = Response(
        {
            "status": "success",
            "message": "登出成功",
        }
    )

    # 删除名为 blog-session 的 Cookie
    response.delete_cookie("blog-session")

    return response
