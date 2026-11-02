from fastapi import FastAPI
from contextlib import asynccontextmanager


from app.database import engine, init_db
from app.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="个人博客 API",
    version="1.0.0",
)

# 一行挂载所有 API 路由
app.include_router(api_router)

@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok"}

@app.get("/api/routes")
def get_routes():
    return {"code": 0, "message": "success", "data": []}