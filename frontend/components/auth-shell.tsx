import Link from "next/link";
import PageBackdrop from "./page-backdrop";
import CardArtwork from "./card-artwork";

// 登录/注册共用外壳：全屏背景 + 居中大卡片（左插画、右表单）
export default function AuthShell({
  mode,
  children,
}: {
  mode: "login" | "register";
  children: React.ReactNode;
}) {
  const isLogin = mode === "login";
  return (
    <main className="relative flex min-h-dvh items-center justify-center p-4 sm:p-6">
      <PageBackdrop />

      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl shadow-slate-950/50">
        <div className="grid md:grid-cols-[1.05fr_1fr]">
          {/* 左侧插画：移动端退化为顶部横幅 */}
          <div className="relative h-36 md:h-auto md:min-h-[560px]">
            <CardArtwork className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/50 to-transparent p-5">
              <p className="text-lg font-bold text-white drop-shadow">栖光集</p>
              <p className="text-xs text-white/85">QIGUANG · 记录生活的光</p>
            </div>
          </div>

          {/* 右侧表单（毛玻璃） */}
          <div className="bg-white/90 p-7 backdrop-blur-xl sm:p-10">
            <h1 className="text-3xl font-bold text-slate-800">
              {isLogin ? "登录" : "注册"}
            </h1>
            <span className="mt-2 block h-1 w-9 rounded-full bg-rose-400" />
            <p className="mt-3 text-sm text-slate-500">
              {isLogin ? "没有账号？" : "已有账号？"}
              <Link
                href={isLogin ? "/register" : "/login"}
                className="ml-1 font-medium text-amber-500 transition-colors hover:text-amber-600"
              >
                {isLogin ? "立即注册 >" : "立即登录 >"}
              </Link>
            </p>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}