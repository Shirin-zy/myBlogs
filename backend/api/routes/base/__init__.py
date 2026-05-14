from fastapi import APIRouter
from .health import router as health_router
from .test_get import router as test_get_router
from .upload import router as upload_router
from .toolset import router as toolset_router
from .overview import router as overview_router

router = APIRouter()
router.include_router(health_router)
router.include_router(test_get_router)
router.include_router(upload_router)
router.include_router(toolset_router)
router.include_router(overview_router)
