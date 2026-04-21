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
    # 按照用户要求，cookie 中的内容为原本的 Authorization 内容，即包含 "Bearer " 前缀
    cookie_value = f"Bearer {token}"

    response = Response(
        {
            "status": "success",
            "message": "登录成功",
            "data": {
                "token": token,
                "user_info": user_payload,
            },
        }
    )

    # 设置 Cookie，名为 blog-session，过期时间设为 24 小时（与 token 一致）
    response.set_cookie(
        key="blog-session",
        value=cookie_value,
        max_age=24 * 3600,
        httponly=True,  # 提高安全性，防止 XSS 获取 cookie
        samesite='Lax'  # 跨站请求保护
    )

    return response
