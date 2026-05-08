import json
import os
from fastapi import APIRouter, Depends, HTTPException, Body
from api.deps import jwt_auth_dependency

router = APIRouter(tags=["article"])

MOCK_FILE = os.path.join("mock", "article.json")

@router.post("/delete")
async def delete_article(id: str = Body(..., embed=True), user=Depends(jwt_auth_dependency)):
    """
    删除文章接口
    需要鉴权，接收 id 参数
    """
    # 1. 读取现有数据
    try:
        if os.path.exists(MOCK_FILE):
            with open(MOCK_FILE, "r", encoding="utf-8") as f:
                articles = json.load(f)
        else:
            return {"code": 404, "message": "文章列表为空，无法删除"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"读取数据失败: {str(e)}")

    # 2. 查找并删除
    initial_count = len(articles)
    articles = [a for a in articles if a.get("id") != id]
    
    if len(articles) == initial_count:
        return {"code": 404, "message": f"未找到 ID 为 {id} 的文章"}

    # 3. 保存回文件
    try:
        with open(MOCK_FILE, "w", encoding="utf-8") as f:
            json.dump(articles, f, ensure_ascii=False, indent=4)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"保存数据失败: {str(e)}")

    return {
        "code": 200,
        "message": "文章删除成功",
        "data": {"id": id}
    }
