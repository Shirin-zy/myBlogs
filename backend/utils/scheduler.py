import asyncio
import json
import os
import datetime
from sqlalchemy.orm import Session
from database import SessionLocal
from models.article import Article
from utils.text_utils import count_readable_words

TASK_RESULT_DIR = "storage/tasks"
STATS_FILE = os.path.join(TASK_RESULT_DIR, "article_stats.json")

async def update_article_stats():
    """
    定时任务：统计文章总数和总字数
    """
    while True:
        try:
            print(f"[{datetime.datetime.now()}] 正在运行定时任务：统计文章字数...")
            
            # 确保目录存在
            if not os.path.exists(TASK_RESULT_DIR):
                os.makedirs(TASK_RESULT_DIR)
                
            db = SessionLocal()
            try:
                # 只统计已发布的文章
                articles = db.query(Article).filter(Article.state == "published").all()
                
                total_count = len(articles)
                total_words = 0
                
                for article in articles:
                    total_words += count_readable_words(article.content)
                
                stats = {
                    "total_articles": total_count,
                    "total_words": total_words,
                    "updated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                
                with open(STATS_FILE, "w", encoding="utf-8") as f:
                    json.dump(stats, f, ensure_ascii=False, indent=4)
                    
                print(f"[{datetime.datetime.now()}] 定时任务完成：总文章 {total_count}, 总字数 {total_words}")
            finally:
                db.close()
                
        except Exception as e:
            print(f"定时任务出错: {str(e)}")
            
        # 每小时运行一次 (3600秒)
        await asyncio.sleep(3600)

def get_latest_stats():
    """
    从文件中读取最新的统计结果
    """
    if os.path.exists(STATS_FILE):
        try:
            with open(STATS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return None
    return None
