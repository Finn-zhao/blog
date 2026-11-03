from datetime import datetime, timedelta ,timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.deps import get_session
from app.models import User
from app.schemas import LoginRequest
from app.config import ACCESS_TOKEN_EXPIRE_HOURS
from app.utils.auth import get_token_claims
from pydantic import BaseModel, Field, field_validator, EmailStr
from sqlalchemy.exc import IntegrityError
from app.utils.auth import verify_password, create_token, hash_password

router = APIRouter(prefix="/api/auth", tags=["认证"])


class RegisterInput(BaseModel):
    username: str = Field(min_length=3, max_length=24, pattern=r"^[a-zA-Z0-9_]+$")
    password: str = Field(min_length=8, max_length=64)
    email: EmailStr

    @field_validator("password")
    @classmethod
    def bcrypt_limit(cls, value):
        if len(value.encode("utf-8")) > 72:
            raise ValueError("密码编码长度不能超过72字节")
        return value

class UpdateUserInput(BaseModel):
    """用户信息更新白名单模型，防止字段注入提权"""
    nickname: str | None = Field(default=None, max_length=50)
    email: str | None = Field(default=None, max_length=100)
    bio: str | None = Field(default=None, max_length=500)
    avatar: str | None = Field(default=None, max_length=500)


@router.post("/register", status_code=201)
def register(data: RegisterInput, session: Session = Depends(get_session)):
    # 检查用户名是否已被使用
    if session.exec(select(User).where(User.username == data.username)).first():
        raise HTTPException(409, "用户名已被使用")
    # 检查邮箱是否已被注册
    if session.exec(select(User).where(User.email == data.email)).first():
        raise HTTPException(409, "邮箱已被注册")
    # nickname 直接设为 username（用户名即昵称）
    user = User(
        username=data.username,
        nickname=data.username,
        email=str(data.email),
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


@router.post("/login")
def login(req: LoginRequest, session: Session = Depends(get_session)):
    # 支持用户名或邮箱登录
    user = session.exec(
        select(User).where(
            (User.username == req.identifier) | (User.email == req.identifier)
        )
    ).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    token = create_token({"sub": user.username, "admin": user.is_admin})
    expires = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)

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
            "email": user.email or "",
            "roles": ["admin"] if user.is_admin else [],
            "permissions": ["*:*:*"] if user.is_admin else [],
        },
    }


@router.get("/me")
def me(user: dict = Depends(get_token_claims), session: Session = Depends(get_session)):
    username = user.get("sub")
    db_user = session.exec(select(User).where(User.username == username)).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return {
        "code": 0,
        "message": "success",
        "data": {
            "avatar": db_user.avatar or "",
            "username": db_user.username,
            "nickname": db_user.nickname or db_user.username,
            "email": db_user.email or "",
            "description": db_user.bio or "",
            "phone": "",
            "roles": ["admin"] if db_user.is_admin else [],
            "permissions": ["*:*:*"] if db_user.is_admin else [],
        },
    }


@router.put("/me")
def update_me(
    data: UpdateUserInput,
    user: dict = Depends(get_token_claims),
    session: Session = Depends(get_session),
):
    username = user.get("sub")
    db_user = session.exec(select(User).where(User.username == username)).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="用户不存在")

    # 白名单方式只更新传来的字段，禁止传入 is_admin 等敏感字段
    if data.nickname is not None:
        db_user.nickname = data.nickname
    if data.email is not None:
        db_user.email = data.email
    if data.bio is not None:
        db_user.bio = data.bio
    if data.avatar is not None:
        db_user.avatar = data.avatar

    db_user.updated_at = datetime.now()
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return {
        "code": 0,
        "message": "更新成功",
        "data": {
            "avatar": db_user.avatar or "",
            "username": db_user.username,
            "nickname": db_user.nickname or db_user.username,
            "email": db_user.email or "",
            "description": db_user.bio or "",
        },
    }