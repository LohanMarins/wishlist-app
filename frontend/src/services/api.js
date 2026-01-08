const API = "https://wishlist-backend-1x5u.onrender.com";

export async function login(username, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getMe() {
  const res = await fetch(`${API}/me`, {
    credentials: "include",
  });
  return res.json();
}

export async function getItems() {
  const res = await fetch(`${API}/items`, {
    credentials: "include",
  });
  return res.json();
}

export async function addItem(item) {
  const res = await fetch(`${API}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(item),
  });
  return res.json();
}

export async function buyItem(id) {
  return fetch(`${API}/items/${id}/buy`, {
    method: "POST",
    credentials: "include",
  });
}

export async function deliverItem(id) {
  return fetch(`${API}/items/${id}/deliver`, {
    method: "POST",
    credentials: "include",
  });
}
