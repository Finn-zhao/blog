// 登录会话的 localStorage 存取。
// 说明：localStorage 方案简单直接，但受 XSS 影响；后端目前把 token 放在响应体返回，
// 暂不支持 httpOnly Cookie，后续后端改造后可平滑迁移（只需改这一个文件）。
import type { LoginData } from "./api";

const KEY = "qiguang.auth";

export interface AuthSession {
  token: string;
  expires: string;
  username: string;
  nickname: string;
  avatar: string;
  roles: string[];
}

export function saveSession(d: LoginData) {
  const session: AuthSession = {
    token: d.accessToken,
    expires: d.expires,
    username: d.username,
    nickname: d.nickname,
    avatar: d.avatar,
    roles: d.roles,
  };
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as AuthSession;
    if (!s.token) return null;
    // 后端 expires 为 ISO 时间（+00:00），过期即视为未登录
    if (s.expires && Date.parse(s.expires) <= Date.now()) {
      clearSession();
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}