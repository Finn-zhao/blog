from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import fastapi_cdn_host

from app.config import CORS_ORIGINS
from app.api import api_router


app = FastAPI(
    title="blog",
    version="0.0.1",
)

fastapi_cdn_host.patch_docs(app) # 自动替换为可访问的资源

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 一行挂载所有 API 路由
app.include_router(api_router)

@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok"}