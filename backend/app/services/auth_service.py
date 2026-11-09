from datetime import datetime, timedelta

from fastapi import HTTPException
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError

from app.models import User
from app.schemas import RegisterInput, LoginRequest, UpdateUserInput
from app.config import ACCESS_TOKEN_EXPIRE_HOURS
from app.utils.auth import hash_password, verify_password, create_token


def register_user(session: Session, data: RegisterInput) -> dict:
    if session.exec(select(User).where(User.username == data.username)).first():
        raise HTTPException(409, "用户名已被使用")

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
        is_admin=False,
    )
    session.add(user)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(409, "用户名已被使用")

    return {"code": 0, "message": "注册成功，请登录"}


def login_user(session: Session, data: LoginRequest) -> dict:
    user = session.exec(select(User).where(User.username == data.username)).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "用户名或密码错误")

    token = create_token({"sub": user.username, "admin": user.is_admin})
    expires = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)

    return {
        "code": 0,
        "message": "success",
        "data": {
            "accessToken": token,
            "refreshToken": "",
            "expires": expires.isoformat(),
            "avatar": user.avatar or "",
            "username": user.username,
            "nickname": user.nickname or user.username,
            "roles": ["admin"] if user.is_admin else [],
            "permissions": ["*:*:*"] if user.is_admin else [],
        },
    }


def get_user_info(session: Session, username: str) -> dict:
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(404, "用户不存在")

    return {
        "code": 0,
        "message": "success",
        "data": {
            "avatar": user.avatar or "",
            "username": user.username,
            "nickname": user.nickname or user.username,
            "email": user.email or "",
            "description": user.bio or "",
            "phone": "",
            "roles": ["admin"] if user.is_admin else [],
            "permissions": ["*:*:*"] if user.is_admin else [],
        },
    }


def update_user_info(session: Session, username: str, data: UpdateUserInput) -> dict:
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(404, "用户不存在")

    if data.nickname is not None:
        user.nickname = data.nickname
    if data.email is not None:
        user.email = data.email
    if data.bio is not None:
        user.bio = data.bio
    if data.avatar is not None:
        user.avatar = data.avatar
    user.updated_at = datetime.now()

    session.add(user)
    session.commit()
    session.refresh(user)

    return {"code": 0, "message": "更新成功"}