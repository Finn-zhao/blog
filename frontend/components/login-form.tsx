"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api";
import { saveSession } from "@/lib/auth-store";
import PasswordInput from "./password-input";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const registered = params.get("registered") === "1";

  const [username, setUsername] = useState(params.get("username") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (!username.trim() || !password) {
      setError("请输入用户名和密码");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await login(username.trim(), password);
      saveSession(data);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "网络异常，请稍后重试");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {registered && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          注册成功，请登录
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="username" className="auth-label">用户名</label>
        <input
          id="username"
          className="auth-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="用户名"
          autoComplete="username"
          maxLength={24}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="auth-label">密码</label>
        <PasswordInput
          id="password"
          value={password}
          onChange={setPassword}
          placeholder="登录密码"
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[15px] font-medium tracking-[0.3em] text-white shadow-lg shadow-sky-500/25 transition-all hover:from-cyan-500 hover:to-blue-600 hover:shadow-sky-500/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
          </svg>
        )}
        {loading ? "登录中" : "登 录"}
      </button>
    </form>
  );
}