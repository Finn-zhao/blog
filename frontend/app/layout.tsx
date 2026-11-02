import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "栖光集", template: "%s · 栖光集" },
  description: "栖光集 —— 记录生活的光",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
