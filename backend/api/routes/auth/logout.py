from fastapi import APIRouter, Response, Depends
from api.deps import jwt_auth_dependency

router = APIRouter(tags=["auth"])

@router.post("/logout")
async def logout(response: Response, user=Depends(jwt_auth_dependency)):
    response.delete_cookie("blog-session")
    return {
        "code": 200,
        "message": "登出成功",
    }
    