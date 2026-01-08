const API = "https://wishlist-backend-1x5u.onrender.com";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(username, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getItems() {
  const res = await fetch(`${API}/items`, {
    headers: authHeader(),
  });
  return res.json();
}

export async function addItem(item) {
  const res = await fetch(`${API}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(item),
  });
  return res.json();
}

export async function buyItem(id) {
  return fetch(`${API}/items/${id}/buy`, {
    method: "POST",
    headers: authHeader(),
  });
}

export async function deliverItem(id) {
  return fetch(`${API}/items/${id}/deliver`, {
    method: "POST",
    headers: authHeader(),
  });
}
