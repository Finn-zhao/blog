import { Suspense } from "react";
import AuthShell from "@/components/auth-shell";
import LoginForm from "@/components/login-form";

export const metadata = { title: "登录" };

export default function LoginPage() {
  return (
    <AuthShell mode="login">
      {/* useSearchParams 需要 Suspense 边界 */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}