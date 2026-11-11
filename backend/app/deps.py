from app.database import get_session
from app.utils.auth import decode_token
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from app.models.user import User

bearer_optional = HTTPBearer(auto_error=False)


def _resolve_user(session: Session, credentials: HTTPAuthorizationCredentials | None) -> User:

    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "未提供认证凭据")

    claims = decode_token(credentials.credentials)
    username = claims.get("sub")
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "用户不存在")
    return user

# 1. 游客也能用，没 token 就返回 None
def get_optional_user(
    session: Session = Depends(get_session),
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_optional),
) -> User | None:
    if credentials is None:
        return None
    return _resolve_user(session, credentials)

# 2. 必须登录（普通用户 + 管理员都能用）
def get_current_user(
    session: Session = Depends(get_session),
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_optional),
) -> User:
    return _resolve_user(session, credentials)

# 3. 必须管理员
def get_current_admin(user: User = Depends(get_current_user)) -> User:
    if not user.is_admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "需要管理员权限")
    return user

__all__ = ["get_session", "get_optional_user", "get_current_user", "get_current_admin"]