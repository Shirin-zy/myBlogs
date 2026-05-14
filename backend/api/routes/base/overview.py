from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from database import get_db
from models.article import Article
from utils.scheduler import get_latest_stats
import datetime

router = APIRouter(tags=["base"])

MONTH_MAP = {
    1: "一月", 2: "二月", 3: "三月", 4: "四月",
    5: "五月", 6: "六月", 7: "七月", 8: "八月",
    9: "九月", 10: "十月", 11: "十一月", 12: "十二月"
}

@router.get("/overview")
async def get_overview(db: Session = Depends(get_db)):
    """
    获取网站概览信息
    1. 月度文章统计 (至少返回3项)
    2. 总文章数与总字数 (从定时任务结果读取)
    """
    try:
        # 1. 月度统计
        # 统计已发布文章
        monthly_query = db.query(
            extract('year', Article.created_at).label('year'),
            extract('month', Article.created_at).label('month'),
            func.count(Article.id).label('count')
        ).filter(Article.state == "published") \
         .group_by('year', 'month') \
         .order_by(func.min(Article.created_at).desc()) \
         .all()

        results = []
        for row in monthly_query:
            results.append({
                "month": MONTH_MAP.get(int(row.month)),
                "year": str(int(row.year)),
                "count": row.count
            })

        # 补全逻辑：如果结果少于3项
        if len(results) < 3:
            # 获取最近的一个月作为起始点，如果没有文章则用当前月
            if results:
                last_year = int(results[-1]["year"])
                # 寻找对应的月份数字
                last_month_num = [k for k, v in MONTH_MAP.items() if v == results[-1]["month"]][0]
            else:
                now = datetime.datetime.now()
                last_year = now.year
                last_month_num = now.month

            while len(results) < 3:
                last_month_num -= 1
                if last_month_num <= 0:
                    last_month_num = 12
                    last_year -= 1
                
                month_name = MONTH_MAP.get(last_month_num)
                # 检查是否已经存在 (避免重复补全)
                if not any(r["month"] == month_name and r["year"] == str(last_year) for r in results):
                    results.append({
                        "month": month_name,
                        "year": str(last_year),
                        "count": 0
                    })

        # 2. 字数统计 (读取定时任务结果)
        stats = get_latest_stats()
        if not stats:
            # 如果文件还没生成，尝试实时计算一次（仅作为降级方案）
            articles = db.query(Article).filter(Article.state == "published").all()
            from utils.text_utils import count_readable_words
            total_words = sum(count_readable_words(a.content) for a in articles)
            stats = {
                "total_articles": len(articles),
                "total_words": total_words
            }

        return {
            "code": 200,
            "message": "获取概览信息成功",
            "data": {
                "monthly_stats": results[:3], # 确保只返回前三项或按需求返回
                "total_articles": stats.get("total_articles", 0),
                "total_words": stats.get("total_words", 0)
            }
        }
    except Exception as e:
        return {
            "code": 500,
            "message": f"获取概览信息失败: {str(e)}",
            "data": None
        }
