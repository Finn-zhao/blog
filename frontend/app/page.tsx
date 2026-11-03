import Link from "next/link";

// 这是一个纯服务端组件，不需要 "use client"
export default function HomePage() {
  return (
    <div>
      <h1>欢迎来到我的博客</h1>
      <ul>
        <li><Link href="/login">点击这里去登录</Link></li>
        <li><Link href="/register">点击这里去注册</Link></li>
      </ul>
    </div>
  );
}