from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import base_router, auth_router, article_router, llm_router

app = FastAPI(title="MyBlog Backend (FastAPI)")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# Note: we use /api as a global prefix for all routes to match original structure
app.include_router(base_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(article_router, prefix="/api")
app.include_router(llm_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5173)
