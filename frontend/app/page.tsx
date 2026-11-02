"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMe, type MeData } from "@/lib/api";
import { getSession, clearSession, type AuthSession } from "@/lib/auth-store";
import PageBackdrop from "@/components/page-backdrop";

export default function HomePage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [me, setMe] = useState<MeData | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (!s) {
      setReady(true);
      return;
    }
    fetchMe(s.token)
      .then(setMe)
      .catch(() => {
        clearSession();
        setSession(null);
      })
      .finally(() => setReady(true));
  }, []);

  function logout() {
    clearSession();
    setSession(null);
    setMe(null);
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center p-4">
      <PageBackdrop />
      <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
        <p className="text-lg font-bold text-slate-800">栖光集</p>
        <p className="mb-6 text-xs text-slate-400">QIGUANG · 记录生活的光</p>

        {!ready ? (
          <p className="py-6 text-center text-sm text-slate-400">加载中…</p>
        ) : session && me ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              {me.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={me.avatar} alt="头像" className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xl font-bold text-white">
                  {(me.nickname || me.username).slice(0, 1).toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-base font-semibold text-slate-800">
                  {me.nickname || me.username}
                  {me.roles.includes("admin") && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-600">
                      管理员
                    </span>
                  )}
                </p>
                <p className="text-sm text-slate-500">@{me.username}</p>
              </div>
            </div>
            {me.description && (
              <p className="text-sm leading-6 text-slate-600">{me.description}</p>
            )}
            <button
              onClick={logout}
              className="h-10 w-full rounded-full border border-slate-300 text-sm text-slate-600 transition-colors hover:border-rose-300 hover:text-rose-500 focus-visible:outline-2 focus-visible:outline-rose-400"
            >
              退出登录
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-slate-500">
              你还没有登录。登录后可以评论、留言和管理你的博客。
            </p>
            <Link
              href="/login"
              className="flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[15px] font-medium tracking-[0.3em] text-white shadow-lg shadow-sky-500/25 transition-all hover:from-cyan-500 hover:to-blue-600"
            >
              登 录
            </Link>
            <Link
              href="/register"
              className="flex h-11 items-center justify-center rounded-full border border-slate-300 text-[15px] tracking-[0.3em] text-slate-600 transition-colors hover:border-sky-400 hover:text-sky-500"
            >
              注 册
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}