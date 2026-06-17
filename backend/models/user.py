from sqlalchemy import Column, String, Text, Integer, DateTime, JSON, BigInteger
from database import Base
import datetime

class User(Base):
    __tablename__ = "user"

    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    email = Column(String(128), nullable=False, unique=True, index=True)
    password = Column(String(128), nullable=False)
    nickname = Column(String(50), nullable=False, default="")
    avatar_url = Column(String(255), nullable=False, default="")
    verify_code = Column(String(32), nullable=False, default="")
    verify_expire_time = Column(DateTime, nullable=True)
    ext_info = Column(JSON, nullable=True)
    role = Column(String(20), nullable=False, default="user")
    status = Column(Integer, nullable=False, default=1)
    create_time = Column(DateTime, nullable=False, default=datetime.datetime.now)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "nickname": self.nickname,
            "avatar_url": self.avatar_url,
            "ext_info": self.ext_info,
            "role": self.role,
            "status": self.status,
            "create_time": self.create_time.strftime("%Y-%m-%d %H:%M:%S") if self.create_time else None
        }
