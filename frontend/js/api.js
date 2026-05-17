
const BASE_URL = '/api';

async function fetchMedicines(search = '') {
  const url = search ? `${BASE_URL}/medicines?search=${encodeURIComponent(search)}` : `${BASE_URL}/medicines`;
  const res = await fetch(url);
  return res.json();
}

async function fetchMedicineById(id) {
  const res = await fetch(`${BASE_URL}/medicines/${id}`);
  return res.json();
}

async function createMedicine(data) {
  const res = await fetch(`${BASE_URL}/medicines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return { ok: res.ok, data: await res.json() };
}

async function updateMedicine(id, data) {
  const res = await fetch(`${BASE_URL}/medicines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return { ok: res.ok, data: await res.json() };
}

async function deleteMedicine(id) {
  const res = await fetch(`${BASE_URL}/medicines/${id}`, { method: 'DELETE' });
  return res.ok;
}

async function logDose(id) {
  const res = await fetch(`${BASE_URL}/medicines/${id}/log-dose`, { method: 'POST' });
  return { ok: res.ok, data: await res.json() };
}

async function fetchDoseLogs(id) {
  const res = await fetch(`${BASE_URL}/medicines/${id}/logs`);
  return res.json();
}

async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  return res.json();
}
async function apiLogin(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return { ok: res.ok, data: await res.json() };
}

async function apiRegister(username, password) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return { ok: res.ok, data: await res.json() };
}

async function apiLogout() {
  await fetch('/api/auth/logout', { method: 'POST' });
}

async function getMe() {
  const res = await fetch('/api/auth/me');
  if (!res.ok) return null;
  return res.json();
}