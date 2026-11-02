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

# GitHub OAuth
GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID", "")
GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET", "")

# 腾讯云 COS 配置；未完整配置时上传自动回退到本地 uploads。
COS_SECRET_ID = os.getenv("COS_SECRET_ID", "")
COS_SECRET_KEY = os.getenv("COS_SECRET_KEY", "")
COS_REGION = os.getenv("COS_REGION", "")
COS_BUCKET = os.getenv("COS_BUCKET", "")
COS_CUSTOM_DOMAIN = os.getenv("COS_CUSTOM_DOMAIN", "")
COS_PREFIX = os.getenv("COS_PREFIX", "blog/")