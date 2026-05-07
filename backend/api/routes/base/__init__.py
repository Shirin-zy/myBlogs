from fastapi import APIRouter
from .health import router as health_router
from .test_get import router as test_get_router

router = APIRouter()
router.include_router(health_router)
router.include_router(test_get_router)
