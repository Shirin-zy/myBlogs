from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    健康检查接口
    """
    return {
        "status": "online",
        "message": "FastAPI 后端服务已成功启动！",
        "version": "1.0.0"
    }
