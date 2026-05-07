from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "online",
        "message": "FastAPI 后端服务已成功启动！",
        "version": "1.0.0"
    }
