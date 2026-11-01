"""公共依赖 — 统一从这里导入 get_session / get_current_user"""

from app.database import get_session
from app.utils.auth import decode_token, get_current_user as get_signed_in_user
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session, select
from app.models.user import User


def get_current_user(claims: dict = Depends(get_signed_in_user), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == claims.get("sub"))).first()
    if not user or not user.is_admin:
        raise HTTPException(403, "需要管理员权限")
    return claims


optional_security = HTTPBearer(auto_error=False)


def get_optional_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(optional_security),
    session: Session = Depends(get_session),
):
    if credentials is None:
        return None
    claims = decode_token(credentials.credentials)
    user = session.exec(select(User).where(User.username == claims.get("sub"))).first()
    if not user or not user.is_admin:
        raise HTTPException(403, "需要管理员权限")
    return claims

__all__ = ["get_session", "get_current_user", "get_optional_admin"]
