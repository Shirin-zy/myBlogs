from typing import Optional
from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str = "anonymous"
    password: Optional[str] = None
