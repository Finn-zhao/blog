"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { setAccessToken } from "@/store/auth-store";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const data = await login({ identifier, password });

      if (data?.data?.accessToken) {
        setAccessToken(data.data.accessToken);
      }

      setMessage("登录成功");
      console.log("登录返回：", data);
    } catch {
      setMessage("网络错误");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          用户名或邮箱
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          密码
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>

      <button type="submit">登录</button>

      {message && <p>{message}</p>}
    </form>
  );
}