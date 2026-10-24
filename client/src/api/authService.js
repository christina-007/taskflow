const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return url.replace(/\/+$/, '');
};

const API_URL = getApiUrl();

const TOKEN_KEY = 'taskflow_auth_token';
const USER_KEY = 'taskflow_auth_user';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const register = async ({ name, email, password }) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data.errors?.map((e) => e.message).join(' ') || data.message || 'Registration failed.';
    const error = new Error(errorMsg);
    error.errors = data.errors;
    throw error;
  }

  setToken(data.token);
  setStoredUser(data.user);
  return data;
};

export const login = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || 'Invalid email or password.');
    throw error;
  }

  setToken(data.token);
  setStoredUser(data.user);
  return data;
};

export const checkAuth = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      logout();
      return null;
    }

    const data = await res.json();
    setStoredUser(data.user);
    return data.user;
  } catch {
    return getStoredUser();
  }
};
