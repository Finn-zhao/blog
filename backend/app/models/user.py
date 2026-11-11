from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

from app.utils.time import utcnow


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(max_length=50, unique=True, index=True)
    hashed_password: str = Field(max_length=128)
    nickname: str = Field(default="", max_length=50)
    avatar: str = Field(default="", max_length=500)
    email: str = Field(max_length=100, unique=True, index=True)
    bio: str = Field(default="", max_length=500)
    is_admin: bool = Field(default=False)
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(
        default_factory=utcnow,
        sa_column_kwargs={"onupdate": utcnow},
    )