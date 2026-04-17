const BASE_URL = 'http://localhost:3000';

export async function registerUser(username, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function loginUser(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getCategories(token, filter = 'all') {
  const res = await fetch(`${BASE_URL}/categories?filter=${filter}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createCategory(token, name) {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function getCategoryExpenses(token, categoryName) {
  const res = await fetch(`${BASE_URL}/categories/${encodeURIComponent(categoryName)}/expenses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getExpenses(token) {
  const res = await fetch(`${BASE_URL}/expenses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addExpense(token, data) {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteExpense(token, id) {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getMonthlySummary(token) {
  const res = await fetch(`${BASE_URL}/expenses/monthly`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getYearlySummary(token) {
  const res = await fetch(`${BASE_URL}/expenses/yearly`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
