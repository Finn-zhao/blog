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


CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS", "http://localhost:3000,http://localhost:5173"
    ).split(",")
    if origin.strip()
]

# main.py 用 allow_credentials=True 挂载 CORS。此时浏览器规范禁止 Origin 为 "*"，
# 结果是请求被静默拒绝、凭据也不发送，表现为"功能莫名失效"。
# 与其静默降级，不如启动即报错，把问题暴露在部署那一刻。
if "*" in CORS_ORIGINS:
    raise RuntimeError(
        "CORS_ORIGINS 不能包含 '*'：已启用 allow_credentials，浏览器会拒绝该组合。"
        "请逐个列出允许的来源，例如 http://127.0.0.1:3000,https://your-domain.com"
    )