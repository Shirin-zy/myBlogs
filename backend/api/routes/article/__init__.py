from fastapi import APIRouter
from .allArticle import router as all_article_router
from .publishedArticle import router as published_article_router
from .save import router as save_router

router = APIRouter()
router.include_router(all_article_router)
router.include_router(published_article_router)
router.include_router(save_router)
