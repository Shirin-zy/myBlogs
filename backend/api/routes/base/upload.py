import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from config import IMAGES_DIR

router = APIRouter(prefix="/upload", tags=["upload"])

# 上传目录配置
UPLOAD_DIR = IMAGES_DIR
# 确保目录存在
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 允许的图片类型
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    """
    上传图片接口
    """
    # 1. 获取并检查文件后缀
    filename = file.filename
    extension = os.path.splitext(filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="不支持的文件格式")

    # 2. 生成唯一文件名，防止冲突
    unique_filename = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # 3. 保存文件到本地
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"文件保存失败: {str(e)}")

    # 4. 返回图片访问 URL
    # 动态使用配置中的 BASE_URL
    file_url = f"http://47.108.73.254/images/{unique_filename}"

    return {"url": file_url, "message": "上传成功"}
