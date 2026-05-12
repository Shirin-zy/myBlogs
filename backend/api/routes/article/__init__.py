from fastapi import APIRouter
from .allArticle import router as all_article_router
from .publishedArticle import router as published_article_router
from .saveArticle import router as save_router
from .articleDetail import router as detail_router
from .deleteArticle import router as delete_router
from .updateStatus import router as update_status_router

router = APIRouter()
router.include_router(all_article_router)
router.include_router(published_article_router)
router.include_router(save_router)
router.include_router(detail_router)
router.include_router(delete_router)
router.include_router(update_status_router)
