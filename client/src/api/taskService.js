const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch tasks with optional filters
 */
export const getTasks = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
  if (params.sort) query.append('sort', params.sort);

  const queryString = query.toString();
  const url = `${API_URL}/tasks${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch tasks.');
  }

  return data;
};

/**
 * Fetch dashboard statistics
 */
export const getTaskStats = async () => {
  const res = await fetch(`${API_URL}/tasks/stats`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch statistics.');
  }

  return data.data;
};

/**
 * Create a new task
 */
export const createTask = async (taskData) => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data.errors?.map((e) => e.message).join(' ') || data.message || 'Failed to create task.';
    const error = new Error(errorMsg);
    error.errors = data.errors;
    throw error;
  }

  return data.data;
};

/**
 * Update an existing task
 */
export const updateTask = async (id, taskData) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data.errors?.map((e) => e.message).join(' ') || data.message || 'Failed to update task.';
    const error = new Error(errorMsg);
    error.errors = data.errors;
    throw error;
  }

  return data.data;
};

/**
 * Delete a task
 */
export const deleteTask = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete task.');
  }

  return data;
};

/**
 * Health check
 */
export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_URL}/health`);
    const data = await res.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
};
