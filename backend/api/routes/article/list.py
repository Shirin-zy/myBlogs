from fastapi import APIRouter, Request, Depends
from api.deps import jwt_auth_dependency

router = APIRouter(tags=["article"])

@router.get("/blogs/articleList")
async def article_list(request: Request, user=Depends(jwt_auth_dependency)):
    mock_articles = [
        {
            "id": "1",
            "title": "薅羊毛神器：利用插件刷取 Microsoft Rewards 积分",
            "created_at": "2025-12-11",
            "tags": ["Chrome扩展", "微软", "脚本"],
            "category": "热门",
            "is_new": True,
            "bgPicture": "https://www.bing.com/th?id=OHR.WalesWinter_ZH-CN3692879767_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 233
        },
        {
            "id": "2",
            "title": "2026最新Chrome扩展开发教程：从入门到发布",
            "created_at": "2025-12-08",
            "tags": ["Chrome扩展", "前端开发", "教程"],
            "category": "技术",
            "is_new": False,
            "bgPicture": "https://www.bing.com/th?id=OHR.BryceCanyonSunrise_ZH-CN8508624321_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 189
        },
        {
            "id": "3",
            "title": "微软Edge浏览器隐藏功能：提升办公效率的10个技巧",
            "created_at": "2025-12-05",
            "tags": ["Edge浏览器", "微软", "办公技巧"],
            "category": "实用工具",
            "is_new": False,
            "bgPicture": "https://www.bing.com/th?id=OHR.HokkaidoSnow_ZH-CN7866417011_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 156
        },
        {
            "id": "4",
            "title": "自动化脚本编写指南：Python实现日常任务批量处理",
            "created_at": "2025-12-01",
            "tags": ["Python", "自动化", "脚本"],
            "category": "技术",
            "is_new": False,
            "bgPicture": "https://www.bing.com/th?id=OHR.VeniceCanal_ZH-CN8100797069_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 127
        },
        {
            "id": "5",
            "title": "如何安全使用浏览器脚本：避开恶意插件的坑",
            "created_at": "2025-11-28",
            "tags": ["浏览器安全", "脚本", "隐私保护"],
            "category": "安全",
            "is_new": False,
            "bgPicture": "https://www.bing.com/th?id=OHR.GrandTetonAutumn_ZH-CN8977257895_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 98
        },
        {
            "id": "6",
            "title": "Microsoft Rewards积分兑换攻略：最大化收益技巧",
            "created_at": "2025-11-25",
            "tags": ["微软", "薅羊毛", "攻略"],
            "category": "热门",
            "is_new": True,
            "bgPicture": "https://www.bing.com/th?id=OHR.SantoriniSunset_ZH-CN9047457885_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 205
        },
        {
            "id": "7",
            "title": "Chrome神级扩展推荐：让浏览器效率翻倍的必备工具",
            "created_at": "2025-12-15",
            "tags": ["Chrome扩展", "效率工具", "推荐"],
            "category": "实用工具",
            "is_new": True,
            "bgPicture": "https://www.bing.com/th?id=OHR.SnowyFox_ZH-CN9203567823_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 176
        },
        {
            "id": "8",
            "title": "Python办公自动化：一键处理Excel/Word/邮件全流程",
            "created_at": "2025-12-14",
            "tags": ["Python", "办公自动化", "实战"],
            "category": "技术",
            "is_new": True,
            "bgPicture": "https://www.bing.com/th?id=OHR.LakeLouiseWinter_ZH-CN9311245678_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 211
        },
        {
            "id": "9",
            "title": "浏览器隐私防护指南：彻底关闭数据追踪与广告推送",
            "created_at": "2025-12-13",
            "tags": ["隐私安全", "浏览器", "防护"],
            "category": "安全",
            "is_new": False,
            "bgPicture": "https://www.bing.com/th?id=OHR.IcelandAurora_ZH-CN9422334567_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 142
        },
        {
            "id": "10",
            "title": "微软Office隐藏技巧：职场人必学的高效办公技能",
            "created_at": "2025-12-12",
            "tags": ["微软", "Office", "办公技巧"],
            "category": "热门",
            "is_new": False,
            "bgPicture": "https://www.bing.com/th?id=OHR.JapanWinter_ZH-CN9533445678_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 248
        },
        {
            "id": "11",
            "title": "零基础入门前端开发：2026年学习路线与资源整理",
            "created_at": "2025-12-10",
            "tags": ["前端开发", "学习路线", "入门"],
            "category": "技术",
            "is_new": False,
            "bgPicture": "https://www.bing.com/th?id=OHR.SwissAlps_ZH-CN9644556789_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 163
        },
        {
            "id": "12",
            "title": "免费实用脚本合集：日常效率提升一键搞定",
            "created_at": "2025-12-09",
            "tags": ["脚本", "效率工具", "免费"],
            "category": "实用工具",
            "is_new": True,
            "bgPicture": "https://www.bing.com/th?id=OHR.NorthernLights_ZH-CN9755667890_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202",
            "comment": 182
        }
    ]
    return {
        "code": 200,
        "message": f"用户 {user.get('username')} 获取文章列表成功",
        "data": {
            "total": len(mock_articles),
            "list": mock_articles
        }
    }
