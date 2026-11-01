from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import InvalidTokenError

from backend.app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_HOURS

security = HTTPBearer()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_token(data: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    return jwt.encode({**data, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="无效的令牌")


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    return decode_token(credentials.credentials)
