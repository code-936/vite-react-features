import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

// ---------------------------------------------------------------------------
// Axios instance with base interceptors
// ---------------------------------------------------------------------------
const axiosInstance = axios.create();

// Request interceptor – attach auth token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – unwrap data or handle global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      // Cancelled requests are not real errors – rethrow so the hook can detect them
      return Promise.reject(error);
    }
    // Global error handling (e.g. 401 redirect) can go here
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      // window.location.href = '/login'; // uncomment to force redirect
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// useApiAxios hook
// ---------------------------------------------------------------------------

/**
 * Custom hook that uses Axios to make API requests.
 *
 * @param {string}  url     - API endpoint URL
 * @param {string}  method  - HTTP method: GET | POST | PUT | PATCH | DELETE
 * @param {object}  params  - URL query params (appended as ?key=value)
 * @param {object}  body    - Request body (for POST / PUT / PATCH)
 * @param {boolean} immediate - Whether to fire the request immediately (default true)
 *
 * @returns {{ isPending, isSuccess, isError, error, data, execute }}
 */
const useApiAxios = ({
  url,
  method = 'GET',
  params = null,
  body = null,
  immediate = true,
} = {}) => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Keep a ref to the AbortController so we can cancel on unmount or re-call
  const abortControllerRef = useRef(null);

  const mutate = useCallback(
    async (overrideBody = null, options = {}) => {
      const { onSuccess, onError, onSettled } = options;
      // Cancel any in-flight request before starting a new one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsPending(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);

      try {
        const response = await axiosInstance({
          url,
          method: method.toUpperCase(),
          params: params || undefined,
          data: overrideBody ?? body ?? undefined,
          signal: abortControllerRef.current.signal,
        });

        setData(response.data);
        setIsSuccess(true);
        onSuccess?.(response);
        onSettled?.(response, null);
        return response;
      } catch (err) {
        if (axios.isCancel(err) || err.name === 'CanceledError') {
          // Request was cancelled – do not update state
          return;
        }
        setIsError(true);
        setError(err.response?.data?.message || err.message || 'An error occurred');
        onError?.(err);
        onSettled?.(null, err);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [url, method, params, body]
  );

  // Fire immediately on mount (and when dependencies change) if requested
  useEffect(() => {
    if (immediate) {
      mutate();
    }

    // Cancel the request when the component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [mutate, immediate]);

  return { mutate, isPending, isError, isSuccess, data, error };
};

export default useApiAxios;
