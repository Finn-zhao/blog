from pydantic import BaseModel, Field, field_validator, EmailStr


class RegisterInput(BaseModel):
    """注册请求校验模型"""
    username: str = Field(min_length=3, max_length=24, pattern=r"^[a-zA-Z0-9_]+$")
    password: str = Field(min_length=8, max_length=64)
    email: EmailStr

    @field_validator("password")
    @classmethod
    def bcrypt_limit(cls, value):
        if len(value.encode("utf-8")) > 72:
            raise ValueError("密码编码长度不能超过72字节")
        return value


class LoginRequest(BaseModel):
    """登录请求校验模型"""
    username: str
    password: str


class UpdateUserInput(BaseModel):
    """用户信息更新白名单模型，防止字段注入提权"""
    nickname: str | None = Field(default=None, max_length=50)
    email: EmailStr | None = Field(default=None)
    bio: str | None = Field(default=None, max_length=500)
    avatar: str | None = Field(default=None, max_length=500)
