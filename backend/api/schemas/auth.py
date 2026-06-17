from typing import Optional
from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None
    verifyCode: Optional[str] = None

class SendVerificationCodeRequest(BaseModel):
    email: str
