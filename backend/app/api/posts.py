from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app.deps import get_session
from app.schemas import PostCreate, PostUpdate, PostOut, PostDetail
from app.services import post_service
from app.models.user import User
from app.deps import get_optional_user,  get_current_admin

router = APIRouter(prefix="/api/posts", tags=["文章"])


# 文章列表：游客看已发布，管理员可看全部
@router.get("", response_model=list[PostOut])
def list_posts(
    status: str | None = None,
    category: str | None = None,
    tag: str | None = None,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=200),
    session: Session = Depends(get_session),
    user: User | None = Depends(get_optional_user),
):
    is_admin = user is not None and user.is_admin
    # 非管理员只能看 published
    if not is_admin and status not in (None, "published"):
        raise HTTPException(404, "文章不存在")
    effective_status = status if is_admin else "published"
    return post_service.get_posts(session, effective_status, category, tag, page, size)


# 文章总数
@router.get("/count")
def post_count(
    status: str | None = None,
    session: Session = Depends(get_session),
    user: User | None = Depends(get_optional_user),
):
    is_admin = user is not None and user.is_admin
    if not is_admin and status not in (None, "published"):
        raise HTTPException(404, "文章不存在")
    effective_status = status if is_admin else "published"
    return {"count": post_service.count_posts(session, effective_status)}


# 按 slug 获取详情（放在具体子路由前面，避免冲突）
@router.get("/{slug}", response_model=PostDetail)
def get_post(
    slug: str,
    session: Session = Depends(get_session),
    user: User | None = Depends(get_optional_user),
):
    is_admin = user is not None and user.is_admin
    return post_service.get_post_by_slug(session, slug, published_only=not is_admin)


# 按 ID 获取详情
@router.get("/detail/{post_id}", response_model=PostDetail)
def get_post_by_id(
    post_id: int,
    session: Session = Depends(get_session),
    user: User | None = Depends(get_optional_user),
):
    is_admin = user is not None and user.is_admin
    return post_service.get_post_by_id(session, post_id, published_only=not is_admin)


# 点赞
@router.post("/{post_id}/like")
def like_post(
    post_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_optional_user),
):
    # 可选：要求登录才能点赞
    if user is None:
        raise HTTPException(401, "请先登录")
    return post_service.toggle_like(session, post_id, unlike=False)


# 取消点赞
@router.post("/{post_id}/unlike")
def unlike_post(
    post_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_optional_user),
):
    if user is None:
        raise HTTPException(401, "请先登录")
    return post_service.toggle_like(session, post_id, unlike=True)


# 创建文章：仅管理员
@router.post("", response_model=PostOut, dependencies=[Depends(get_current_admin)])
def create_post(
    data: PostCreate,
    session: Session = Depends(get_session),
):
    return post_service.create_post(session, data)


# 更新文章：仅管理员
@router.put("/{post_id}", response_model=PostOut, dependencies=[Depends(get_current_admin)])
def update_post(
    post_id: int,
    data: PostUpdate,
    session: Session = Depends(get_session),
):
    return post_service.update_post(session, post_id, data)


# 删除文章：仅管理员
@router.delete("/{post_id}", dependencies=[Depends(get_current_admin)])
def delete_post(
    post_id: int,
    session: Session = Depends(get_session),
):
    post_service.delete_post(session, post_id)
    return {"ok": True}