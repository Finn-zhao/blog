const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function register(body: {
  username: string;
  password: string;
  email: string;
}) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
}

export async function login(body: { identifier: string; password: string }) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
}