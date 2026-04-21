from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    """
    后端服务状态检查 API
    """
    return Response({
        "status": "online",
        "message": "Django 后端服务已成功启动！",
        "version": "1.0.0"
    })

@api_view(['GET'])
def test_get(request):
    """
    GET 方法测试接口
    """
    return Response({
        "message": "这是一个 GET 方法测试接口的返回内容",
        "data": {
            "item": "测试数据",
            "description": "Django REST Framework 运行正常"
        }
    })
