"use client";

import { useState } from "react";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const data = await register({ username, password, email });
      setMessage(data?.message || "注册成功");
    } catch {
      setMessage("网络错误");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          用户名
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

      <div>
        <label>
          邮箱
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
      </div>

      <button type="submit">注册</button>

      {message && <p>{message}</p>}
    </form>
  );
}