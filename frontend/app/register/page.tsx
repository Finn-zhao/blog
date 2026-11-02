import AuthShell from "@/components/auth-shell";
import RegisterForm from "@/components/register-form";

export const metadata = { title: "注册" };

export default function RegisterPage() {
  return (
    <AuthShell mode="register">
      <RegisterForm />
    </AuthShell>
  );
}