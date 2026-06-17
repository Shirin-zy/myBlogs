from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.schemas.auth import SendVerificationCodeRequest
from database import get_db
from models.user import User
from utils.email_utils import generate_verification_code, send_verification_email
import datetime

router = APIRouter(tags=["auth"])


@router.post("/send-verification-code")
async def send_verification_code(
    request_data: SendVerificationCodeRequest, db: Session = Depends(get_db)
):
    """
    发送验证码到用户邮箱
    """
    email = request_data.email

    # 查找或创建用户
    user = db.query(User).filter(User.email == email).first()

    # 生成验证码
    verification_code = generate_verification_code()

    # 计算过期时间（5分钟后）- 使用本地时间
    expire_time = datetime.datetime.now() + datetime.timedelta(minutes=5)

    if user:
        # 更新现有用户的验证码
        user.verify_code = verification_code
        user.verify_expire_time = expire_time
    else:
        # 创建新用户
        user = User(
            email=email,
            password="",  # 初始密码为空，注册时设置
            nickname=email.split("@")[0],  # 默认昵称使用邮箱前缀
            verify_code=verification_code,
            verify_expire_time=expire_time,
            role="user",
            status=1,
        )
        db.add(user)

    db.commit()

    # 发送邮件
    email_result = send_verification_email(email, verification_code)

    if email_result:
        return {"code": 200, "message": "验证码发送成功", "data": None}
    else:
        return {"code": 500, "message": "验证码发送失败，请稍后重试", "data": None}
