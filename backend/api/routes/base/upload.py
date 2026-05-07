import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/upload", tags=["upload"])

# 上传目录配置
UPLOAD_DIR = "uploads/images"
# 确保目录存在
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 允许的图片类型
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
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
    # 注意：这里的 URL 需要根据你后端运行的 host 和 port 调整
    # 假设后端运行在 http://127.0.0.1:5173
    file_url = f"http://127.0.0.1:5173/uploads/images/{unique_filename}"
    
    return {
        "url": file_url,
        "message": "上传成功"
    }
