"""汇总所有 API 子路由，main.py 只需 include_router(api_router) 即可"""

from fastapi import APIRouter

from app.api.auth import router as auth_router


api_router = APIRouter()

api_router.include_router(auth_router)

