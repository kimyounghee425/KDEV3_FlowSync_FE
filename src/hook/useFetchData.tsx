import { useEffect, useState } from "react";

type FetchStatus<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useFetchData<T>(fetchFunction: () => Promise<T>) {
  const [status, setStatus] = useState<FetchStatus<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus({ data: null, loading: true, error: null });
        const data = await fetchFunction();
        setStatus({ data, loading: false, error: null });
      } catch (err) {
        setStatus({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    };

    fetchData();
  }, [fetchFunction]);

  return status;
}
