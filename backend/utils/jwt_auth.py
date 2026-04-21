import jwt
import datetime
from django.conf import settings

from functools import wraps
from rest_framework.response import Response
from rest_framework import status

def generate_token(payload: dict, expiry_hours: int = 24) -> str:
    """
    生成 JWT Token
    :param payload: 包含用户信息的字典 (例如: {"user_id": 1, "username": "admin"})
    :param expiry_hours: 过期时间（小时），默认为 24 小时
    :return: 编码后的 JWT 字符串
    """
    # 复制 payload 以避免修改原始数据
    data = payload.copy()
    
    # 设置过期时间
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=expiry_hours)
    data.update({
        "exp": expire,
        "iat": datetime.datetime.utcnow()  # 签发时间
    })
    
    # 使用 Django 的 SECRET_KEY 进行签名
    token = jwt.encode(data, settings.SECRET_KEY, algorithm="HS256")
    return token

def verify_token(token: str) -> dict:
    """
    校验 JWT Token
    :param token: 待校验的 Token 字符串
    :return: 解码后的 payload 字典，如果校验失败则返回 None
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        # Token 已过期
        return None
    except jwt.InvalidTokenError:
        # Token 无效
        return None

def get_auth_user(request) -> dict:
    """
    从请求头中提取并校验 Bearer Token
    :param request: Django request 对象
    :return: 校验成功返回用户信息 payload，失败返回 None
    """
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    return verify_token(token)

def jwt_auth_required(view_func):
    """
    JWT 鉴权装饰器
    用于校验请求头中的 Authorization: Bearer <token>
    """
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        user = get_auth_user(request)
        if not user:
            return Response({
                "code": 403,
                "message": "无权限：请提供有效的 Bearer Token (Authorization: Bearer <token>)"
            }, status=status.HTTP_403_FORBIDDEN)
        
        # 将解析出的用户信息注入 request 对象，方便视图函数使用
        request.auth_user = user
        return view_func(request, *args, **kwargs)
    
    return wrapped_view
