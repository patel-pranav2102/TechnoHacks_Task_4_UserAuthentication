export const API = "https://backend-4-9bf6.onrender.com/api";

const defaultOpts = {
  credentials: "include",
  headers: { "Content-Type": "application/json" }
};

export async function register(data) {
  const res = await fetch(`${API}/auth/register`, { method: "POST", body: JSON.stringify(data), ...defaultOpts });
  return res.json();
}
export async function login(data) {
  const res = await fetch(`${API}/auth/login`, { method: "POST", body: JSON.stringify(data), ...defaultOpts });
  return res.json();
}
export async function logout() {
  const res = await fetch(`${API}/auth/logout`, { method: "POST", ...defaultOpts });
  return res.json();
}
export async function me() {
  const res = await fetch(`${API}/auth/me`, { method: "GET", ...defaultOpts });
  return res.json();
}
