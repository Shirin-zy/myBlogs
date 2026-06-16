from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime, JSON
from database import Base
import datetime

class Article(Base):
    __tablename__ = "articles"

    id = Column(String(36), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    tags = Column(JSON, nullable=True)  # 存储为 JSON 数组
    category = Column(String(100), nullable=True)
    is_new = Column(Boolean, default=True)
    bgPicture = Column(String(500), nullable=True)
    state = Column(String(20), default="draft")  # published, draft, takeoff
    comment = Column(Integer, default=0)
    views = Column(Integer, default=0)  # 文章查看次数
    author = Column(String(100), nullable=True)
    location = Column(String(100), nullable=True)  # 文章发布者地理位置

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "created_at": self.created_at.strftime("%Y-%m-%d") if self.created_at else None,
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S") if self.updated_at else None,
            "tags": self.tags,
            "category": self.category,
            "is_new": self.is_new,
            "bgPicture": self.bgPicture,
            "state": self.state,
            "comment": self.comment,
            "views": self.views,
            "author": self.author,
            "location": self.location
        }
