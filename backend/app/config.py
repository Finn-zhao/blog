import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
# 宝塔/系统环境变量python -m uvicorn app.main:app --reload优先；本地 .env 仅补齐未设置的值，避免生产配置被上传文件覆盖。
load_dotenv(BASE_DIR / ".env", override=False)

DATABASE_URL = os.environ["DATABASE_URL"]
SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 72

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")