import { getToken, logout } from './authService';

const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return url.replace(/\/+$/, '');
};

const API_URL = getApiUrl();

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (res.status === 401) {
    logout();
    window.dispatchEvent(new Event('taskflow:unauthorized'));
    throw new Error(data.message || 'Session expired. Please log in.');
  }
  if (!res.ok) {
    const errorMsg = data.errors?.map((e) => e.message).join(' ') || data.message || 'Request failed.';
    const error = new Error(errorMsg);
    error.errors = data.errors;
    throw error;
  }
  return data;
};

/**
 * Fetch tasks with optional filters for current user
 */
export const getTasks = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
  if (params.sort) query.append('sort', params.sort);

  const queryString = query.toString();
  const url = `${API_URL}/tasks${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};

/**
 * Fetch dashboard statistics for current user
 */
export const getTaskStats = async () => {
  const res = await fetch(`${API_URL}/tasks/stats`, {
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data;
};

/**
 * Create a new task
 */
export const createTask = async (taskData) => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });

  const data = await handleResponse(res);
  return data.data;
};

/**
 * Update an existing task
 */
export const updateTask = async (id, taskData) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });

  const data = await handleResponse(res);
  return data.data;
};

/**
 * Delete a task
 */
export const deleteTask = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};

/**
 * Health check
 */
export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_URL}/health`);
    const data = await res.json();
    return data;
  } catch {
    return { status: 'error' };
  }
};
