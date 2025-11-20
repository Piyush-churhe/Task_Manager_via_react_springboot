// src/services/api.js

// Base URL for your Spring Boot backend
const BASE_URL = 'https://task-manager-0-ev1i.onrender.com/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Authentication API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return await response.json();
  }
};

// Tasks API calls
export const taskAPI = {
  getAllTasks: async () => {
    const response = await fetch(`${BASE_URL}/tasks`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    return await response.json();
  },

  createTask: async (taskData) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    return await response.json();
  },

  updateTask: async (taskId, taskData) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    return await response.json();
  },

  deleteTask: async (taskId) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    return await response.json();
  }
};

// Admin API calls
export const adminAPI = {
  getAllUsers: async () => {
    const response = await fetch(`${BASE_URL}/admin/users`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return await response.json();
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }
};