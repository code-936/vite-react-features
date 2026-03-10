import { useState, useEffect, useRef } from 'react';

/**
 * @param url
 * @param method
 *
 * @returns {{ isPending, isSuccess, isError, data, error }}
 */

/**
 * Why AbortController?
 * AbortController is to cancel the request whenever applicable:
 * 1. Avoid bugs and memory leaks
 * Component is unmounted for any reason(User navigates to different page) before the request is complete.
 * setState on unavailable component causes unexpected bugs and memory leaks.
 * 2. Outdated data due to Race Conditions.
 * App makes API requests to fetch data for each key press in the seach box (eg: 'Pavan')
 * First API request after user types in 'Pav' - Request 1 (slow)
 * Second API request after user types in compelte term 'Pavan' - Request 2 (Fast)
 * Request 2 completes first and updates state with relevant results to the complete search term
 * Request 1 completes after Request 2 to update the state with results for the partial search term 'Pav'
 * End user will be provided with outdated data.
 * 3. Handling Timeouts - You can manually cancel request after a specific duration to prevent application from hanging indefinitely.
 * AbortController - Abort the request on component unmount using return function within useEffect.
 * The AbortController provides a signal that you pass to the fetch API. When you call .abort(), the fetch promise is immediately rejected.
 */

export const useApiFetch = (url, method = 'GET') => {
  const [isPending, setIsPending] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const fetchData = async (url, method) => {
    setIsPending(true);
    setIsSuccess(false);
    setIsError(false);
    try {
      const res = await fetch(url, { signal: abortControllerRef.current.signal });
      if (!res.ok) {
        throw new Error('Something went wrong');
      }
      const resData = await res.json();
      setIsSuccess(true);
      setData(resData);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Aborting the request..');
      } else {
        setIsError(true);
        setError(err instanceof Error ? err.message : error || 'Something went wrong');
      }
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    fetchData(url, 'GET');
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { isPending, isSuccess, isError, data, error };
};
