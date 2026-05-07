import jwt
import datetime
from typing import Optional, Dict
from fastapi import Request, HTTPException, status
from functools import wraps

# Use the same secret key as Django for consistency
SECRET_KEY = 'django-insecure-1d6jk2p8mvxu-w8pd5k#jgwbsq-o)nwa9#p1v(9w4ro2clfhoi'

def generate_token(payload: dict, expiry_hours: int = 24) -> str:
    """
    生成 JWT Token
    """
    data = payload.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=expiry_hours)
    data.update(
        {
            "exp": expire,
            "iat": datetime.datetime.utcnow(),
        }
    )
    token = jwt.encode(data, SECRET_KEY, algorithm="HS256")
    return token

def verify_token(token: str) -> Optional[dict]:
    """
    校验 JWT Token
    """
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def get_auth_user(request: Request) -> Optional[dict]:
    """
    从 Cookie 中提取并校验 Token
    """
    auth_cookie = request.cookies.get("blog-session")
    return verify_token(auth_cookie)

async def jwt_auth_dependency(request: Request):
    """
    FastAPI 依赖项，用于 JWT 鉴权
    """
    user = get_auth_user(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限：请提供有效的 Cookie (blog-session: <token>)",
        )
    request.state.user = user
    return user
