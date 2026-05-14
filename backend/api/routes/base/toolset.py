from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models.toolset import Toolset
from typing import Optional, List

router = APIRouter(tags=["base"])

@router.get("/toolset")
async def get_toolset(
    categoryId: Optional[str] = Query(None, description="分类ID"),
    db: Session = Depends(get_db)
):
    """
    获取工具网站列表接口
    支持通过 categoryId 过滤，不分页返回所有结果
    """
    try:
        query = db.query(Toolset)
        
        if categoryId:
            query = query.filter(Toolset.categoryId == categoryId)
            
        toolsets = query.all()
        
        result = [tool.to_dict() for tool in toolsets]
        
        return {
            "code": 200,
            "message": "获取工具列表成功",
            "data": result
        }
    except Exception as e:
        return {
            "code": 500,
            "message": f"获取工具列表失败: {str(e)}",
            "data": []
        }
