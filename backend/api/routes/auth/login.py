from fastapi import APIRouter, Response
from api.schemas.auth import LoginRequest
from utils.fastapi_utils import generate_token

router = APIRouter(tags=["auth"])


@router.post("/login")
async def login(request_data: LoginRequest, response: Response):
    if (
        request_data.email == "1820207034@qq.com"
        and request_data.password == "Aa123456"
    ):
        user_payload = {
            "user_id": "9527",
            "username": "Shinanoゎ",
            "role": "admin",
        }
        token = generate_token(user_payload)

        response.set_cookie(
            key="blog-session",
            value=token,
            max_age=24 * 3600,
            httponly=True,
            samesite="lax",
        )

        return {
            "code": 200,
            "message": "登录成功",
            "data": {
                "token": token,
                "user_info": user_payload,
            },
        }
    else:
        return {
            "code": 400,
            "message": "邮箱或密码错误",
        }
