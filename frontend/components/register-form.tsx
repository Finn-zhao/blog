"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";
import PasswordInput from "./password-input";

// 与后端 RegisterInput 保持一致的前端校验
function validate(
  username: string,
  nickname: string,
  password: string,
  confirm: string,
): string {
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username))
    return "用户名需为 3-24 位字母、数字或下划线";
  if (!nickname.trim()) return "昵称不能为空";
  if (nickname.trim().length > 24) return "昵称不能超过 24 个字符";
  if (password.length < 8 || password.length > 64)
    return "密码长度需为 8-64 位";
  if (new TextEncoder().encode(password).length > 72)
    return "密码编码长度不能超过 72 字节";
  if (password !== confirm) return "两次输入的密码不一致";
  return "";
}

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    const msg = validate(username, nickname, password, confirm);
    if (msg) {
      setError(msg);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register({ username, password, nickname: nickname.trim() });
      // 注册成功 → 跳登录页并预填用户名
      router.push(`/login?registered=1&username=${encodeURIComponent(username)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "网络异常，请稍后重试");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="reg-username" className="auth-label">用户名</label>
        <input
          id="reg-username"
          className="auth-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="3-24 位字母、数字或下划线"
          autoComplete="username"
          maxLength={24}
          required
        />
      </div>

      <div>
        <label htmlFor="reg-nickname" className="auth-label">昵称</label>
        <input
          id="reg-nickname"
          className="auth-input"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="对外展示的名字"
          maxLength={24}
          required
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="auth-label">密码</label>
        <PasswordInput
          id="reg-password"
          value={password}
          onChange={setPassword}
          placeholder="8-64 位密码"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label htmlFor="reg-confirm" className="auth-label">确认密码</label>
        <PasswordInput
          id="reg-confirm"
          value={confirm}
          onChange={setConfirm}
          placeholder="再输入一次密码"
          autoComplete="new-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-[15px] font-medium tracking-[0.3em] text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-500 hover:to-green-600 hover:shadow-emerald-500/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
          </svg>
        )}
        {loading ? "注册中" : "注 册"}
      </button>
    </form>
  );
}