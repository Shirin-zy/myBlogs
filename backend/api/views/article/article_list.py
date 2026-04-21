from rest_framework.decorators import api_view
from rest_framework.response import Response
from utils.jwt_auth import jwt_auth_required


@api_view(["GET"])
@jwt_auth_required
def article_list(request):
    """
    获取文章列表接口
    通过装饰器自动校验请求头中的 Bearer Token
    """
    # 鉴权后的用户信息已由装饰器注入到 request.auth_user
    user = request.auth_user

    # Mock 文章列表数据
    mock_articles = [
        {
            "id": "1",
            "title": "薅羊毛神器：利用插件刷取 Microsoft Rewards 积分",
            "created_at": "2025-12-11",
            "tags": ["Chrome扩展", "微软", "脚本"],
            "category": "热门",
            "is_new": True,
            "bgPicture": "https://www.bing.com/th?id=OHR.WalesWinter_ZH-CN3692879767_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 233,
        },
        {
            "id": "2",
            "title": "2026最新Chrome扩展开发教程：从入门到发布",
            "created_at": "2025-12-08",
            "tags": ["Chrome扩展", "前端开发", "教程"],
            "category": "技术",
            "is_new": False,
            "bgPicture": "https://www.bing.com/th?id=OHR.BryceCanyonSunrise_ZH-CN8508624321_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 189,
        },
        {
            "id": "3",
            "title": "微软Edge浏览器隐藏功能：提升办公效率的10个技巧",
            "created_at": "2025-12-05",
            "tags": ["Edge浏览器", "微软", "办公技巧"],
            "category": "实用工具",
            "is_new": False,
            "bgPicture": "https://www.bing.com/th?id=OHR.HokkaidoSnow_ZH-CN7866417011_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 156,
        },
        {
            "id": "4",
            "title": "自动化脚本编写指南：Python实现日常任务批量处理",
            "created_at": "2025-12-01",
            "tags": ["Python", "自动化", "脚本"],
            "category": "技术",
            "is_new": False,
            "bgPicture": "https://www.bing.com/th?id=OHR.VeniceCanal_ZH-CN8100797069_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 127,
        },
        {
            "id": "5",
            "title": "如何安全使用浏览器脚本：避开恶意插件的坑",
            "created_at": "2025-11-28",
            "tags": ["浏览器安全", "脚本", "隐私保护"],
            "category": "安全",
            "is_new": False,
            "bgPicture": "https://www.bing.com/th?id=OHR.GrandTetonAutumn_ZH-CN8977257895_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 98,
        },
        {
            "id": "6",
            "title": "Microsoft Rewards积分兑换攻略：最大化收益技巧",
            "created_at": "2025-11-25",
            "tags": ["微软", "薅羊毛", "攻略"],
            "category": "热门",
            "is_new": True,
            "bgPicture": "https://www.bing.com/th?id=OHR.SantoriniSunset_ZH-CN9047457885_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 205,
        },
    ]

    return Response(
        {
            "code": 200,
            "message": f"用户 {user.get('username')} 获取文章列表成功",
            "data": {"total": len(mock_articles), "list": mock_articles},
        }
    )
