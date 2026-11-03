import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "blog", template: "" },
  description: "go",
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
