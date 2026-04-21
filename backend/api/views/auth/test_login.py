from rest_framework.decorators import api_view
from rest_framework.response import Response
from utils.jwt_auth import generate_token


@api_view(["POST"])
def test_login(request):
    """
    POST 方法测试登录接口（不论账号密码，一律返回成功并生成鉴权 Token）
    """
    username = request.data.get("username", "anonymous")
    password = request.data.get("password")

    # 模拟从数据库获取的用户唯一 ID 和其他信息
    user_payload = {
        "user_id": "9527",  # 硬编码的唯一 ID
        "username": username,
        "role": "admin",
    }

    # 生成 Token，默认过期时间为 24 小时
    token = generate_token(user_payload)

    return Response(
        {
            "status": "success",
            "message": "登录成功",
            "data": {
                "token": token,
                "user_info": user_payload,
            },
        }
    )
