import { useMutation } from '@tanstack/react-query';

/**
 * Generic API service function
 * @param {string} url - API endpoint URL
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {object} body - Request body data
 * @returns {Promise} - Promise with response data
 */
export const apiService = async ({ url, method = 'GET', body = null }) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP Error: ${response.status}`);
  }

  return {
    status: response.status,
    statusText: response.statusText,
    data,
    error: null,
  };
};

/**
 * Custom hook for API mutations (POST, PUT, DELETE, etc.)
 * @param {string} url - API endpoint URL
 * @param {string} method - HTTP method
 * @returns {object} - Mutation object with mutate function, isLoading, error, data
 */
export const useApiMutation = (url, method = 'POST') => {
  return useMutation({
    mutationFn: (body) => apiService({ url, method, body }),
  });
};

/** Could be used without Tanstack Query
 * Login API service
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise} - Promise with login response
 */
export const loginUser = async (username, password) => {
  // For demo purposes, using a mock API or replace with your actual API endpoint
  const url = 'http://localhost:3002/auth/login';
  
  return apiService({
    url,
    method: 'POST',
    body: { username, password },
  });
};
