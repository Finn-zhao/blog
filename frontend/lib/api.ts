// 后端 API 客户端。对接后端的 /api/auth/* 接口。
// 浏览器只请求同源 /api（由 next.config.ts 的 rewrites 转发），无需处理跨域。

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  expires: string;
  avatar: string;
  username: string;
  nickname: string;
  roles: string[];
  permissions: string[];
}

export interface MeData {
  avatar: string;
  username: string;
  nickname: string;
  email: string;
  description: string;
  roles: string[];
  permissions: string[];
}

interface Envelope<T> {
  code: number;
  message: string;
  data: T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function parseError(res: Response): Promise<never> {
  let msg = `请求失败（${res.status}）`;
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") msg = body.detail;
    else if (Array.isArray(body?.detail)) msg = body.detail[0]?.msg ?? msg;
    else if (typeof body?.message === "string" && body.code !== 0)
      msg = body.message;
  } catch {
    /* 非 JSON 响应，保留默认提示 */
  }
  throw new ApiError(res.status, msg);
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "网络异常，请稍后重试");
  }
  if (!res.ok) await parseError(res);
  return (await res.json()) as T;
}

export function login(username: string, password: string) {
  return post<Envelope<LoginData>>("/api/auth/login", { username, password }).then(
    (b) => b.data,
  );
}

export function register(input: {
  username: string;
  password: string;
  nickname: string;
}) {
  return post<Envelope<null>>("/api/auth/register", input);
}

export async function fetchMe(token: string): Promise<MeData> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "网络异常，请稍后重试");
  }
  if (!res.ok) await parseError(res);
  return ((await res.json()) as Envelope<MeData>).data;
}