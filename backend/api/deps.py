from fastapi import Request, HTTPException, status
from utils.fastapi_utils import get_auth_user

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
