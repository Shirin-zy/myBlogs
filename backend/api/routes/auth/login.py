from fastapi import APIRouter, Response, Depends
from sqlalchemy.orm import Session
from api.schemas.auth import LoginRequest
from utils.fastapi_utils import generate_token
from database import get_db
from models.user import User
import datetime

router = APIRouter(tags=["auth"])


@router.post("/login")
async def login(
    request_data: LoginRequest, response: Response, db: Session = Depends(get_db)
):
    """
    用户登录接口，支持密码登录和验证码登录
    - 有 password 字段则走密码登录逻辑
    - 有 verifyCode 字段则走验证码登录逻辑
    """
    # 查找用户
    user = db.query(User).filter(User.email == request_data.email).first()

    if not user:
        return {
            "code": 400,
            "message": "用户不存在",
        }

    # 检查用户状态
    if user.status != 1:
        return {
            "code": 400,
            "message": "账户已被禁用",
        }

    # 判断登录方式
    if request_data.password:
        # 密码登录
        # 注意：目前密码直接存储在数据库中，后续应使用 bcrypt 加密
        if user.password != request_data.password:
            return {
                "code": 400,
                "message": "密码错误",
            }
    elif request_data.verifyCode:
        # 验证码登录
        if not user.verify_code or not user.verify_expire_time:
            return {
                "code": 400,
                "message": "请先获取验证码",
            }

        # 检查验证码是否正确
        if user.verify_code != request_data.verifyCode:
            return {
                "code": 400,
                "message": "验证码错误",
            }

        # 检查验证码是否过期
        if datetime.datetime.now() > user.verify_expire_time:
            return {
                "code": 400,
                "message": "验证码已过期，请重新获取",
            }

        # 登录成功，清除验证码和过期时间，防止二次使用
        user.verify_code = ""
        user.verify_expire_time = None
    else:
        return {
            "code": 400,
            "message": "请提供密码或验证码",
        }

    # 登录成功，生成 Token
    user_payload = {
        "user_id": str(user.id),
        "username": user.nickname,
        "nickname": user.nickname,
        "role": user.role,
    }
    token = generate_token(user_payload)

    # 提交数据库更改（清除验证码等）
    db.commit()

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
