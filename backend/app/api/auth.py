from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.deps import get_session, get_current_user
from app.models import User
from app.schemas import RegisterInput, LoginRequest, UpdateUserInput
from app.services import register_user, login_user, get_user_info, update_user_info

router = APIRouter(prefix="/api/auth", tags=["认证"])


@router.post("/register", status_code=201)
def register(data: RegisterInput, session: Session = Depends(get_session)):
    return register_user(session, data)


@router.post("/login")
def login(req: LoginRequest, session: Session = Depends(get_session)):
    return login_user(session, req)


@router.get("/me")
def me(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return get_user_info(session, user.username)


@router.put("/me")
def update_me(
    data: UpdateUserInput,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return update_user_info(session, user.username, data)