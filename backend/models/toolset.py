from sqlalchemy import Column, String, Integer, Text
from database import Base

class Toolset(Base):
    __tablename__ = "toolsets"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    categoryId = Column(String(50), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    desc = Column(Text, nullable=True)
    url = Column(String(500), nullable=False)
    iconUrl = Column(String(500), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "categoryId": self.categoryId,
            "name": self.name,
            "desc": self.desc,
            "url": self.url,
            "iconUrl": self.iconUrl
        }
