from fastapi import APIRouter
from .wait_review import router as wait_review_router
from .list import router as list_router

router = APIRouter()
router.include_router(wait_review_router)
router.include_router(list_router)
