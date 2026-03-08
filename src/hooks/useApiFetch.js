/**
 * Custom Hook to accept API parameters to return state and response
 * @param url
 * @param method
 * @param params
 * @param body
 *
 * @returns {{ isPending, isSuccess, isError, data, error }}
 */

import { useState, useEffect } from 'react';

export const useApiFetch = () => {
  const [isPending, setIsPending] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!res.ok) {
        throw new Error('Something went wrong');
      }
      const users = await res.json();
      setIsSuccess(true);
      setData(users);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    // await fetch('https://jsonplaceholder.typicode.com/users')
    //   .then((res) => {
    //     if (!res.ok) throw new Error('Something went wrong');
    //     return res.json();
    //   })
    //   .then((resData) => {
    //     setData(resData);
    //     setIsPending(false);
    //     setIsSuccess(true);
    //   })
    //   .catch((error) => {
    //     setIsPending(false);
    //     setIsError(true);
    //     setError(error.message);
    //   })
    //   .finally(setIsPending(false));

    fetchData();
  }, []);

  return { isPending, isSuccess, isError, data, error };
};
