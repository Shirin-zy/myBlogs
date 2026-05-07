from fastapi import APIRouter

router = APIRouter()

@router.get("/test-get")
async def test_get():
    return {
        "message": "这是一个 GET 方法测试接口的返回内容",
        "data": {
            "item": "测试数据",
            "description": "FastAPI 运行正常"
        }
    }
