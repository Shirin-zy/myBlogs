from typing import Optional
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str = "anonymous"
    password: Optional[str] = None
