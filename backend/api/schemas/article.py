from typing import List, Optional
from pydantic import BaseModel

class ArticleSaveRequest(BaseModel):
    id: Optional[str] = None
    title: str
    content: str
    tags: Optional[List[str]] = []
    category: Optional[str] = "默认"
    bgPicture: Optional[str] = ""
    published: Optional[bool] = True
    state: Optional[str] = None
