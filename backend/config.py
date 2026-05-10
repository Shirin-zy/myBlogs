import os
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

# 后端运行配置
HOST = os.getenv("BACKEND_HOST", "0.0.0.0")
PORT = int(os.getenv("BACKEND_PORT", "5173"))

# 图片访问的基础 URL
# 如果是服务器 IP 地址，设置为 http://47.108.73.254:5173 (或者 80 如果使用了 Nginx 转发)
BASE_URL = os.getenv("BASE_URL", f"http://127.0.0.1:{PORT}")

# 上传目录配置
UPLOAD_DIR = "uploads"
IMAGES_DIR = os.path.join(UPLOAD_DIR, "images")
