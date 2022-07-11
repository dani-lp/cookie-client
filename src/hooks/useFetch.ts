import * as React from 'react';
import type { AxiosError, AxiosResponse } from 'axios';
import { axios } from '../lib/axios';

// type guards
const isAbortError = (error: AxiosError | Error): error is DOMException => {
  if (error && error.name === 'AbortError') {
    return true;
  }
  return false;
};

export const useFetch = (url: string) => {
  const [response, setResponse] = React.useState<AxiosResponse | null>(null);
  const [error, setError] = React.useState<AxiosError | Error | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);

    (async () => {
      try {
        const response = await axios.get(url, { signal: abortController.signal });
        setResponse(response);
        setError(null);
        setIsLoading(false);
      } catch (error) {
        const err = error as AxiosError | Error;
        if (isAbortError(err)) {
          return;
        }
        setError(err);
        setResponse(null);
        setIsLoading(false);
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [url]);

  return { response, error, isLoading };
};