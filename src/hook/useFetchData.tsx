import { CommonResponseType } from "@/src/types";
import { useEffect, useState } from "react";

interface UseFetchDataProps<T, P extends any[]> {
  fetchApi: (...args: P) => Promise<CommonResponseType<T>>;
  params?: P;
  dependencies?: any[];
}

export function useFetchData<T, P extends any[]>({
  fetchApi,
  params = [] as unknown as P,
  dependencies = [],
}: UseFetchDataProps<T, P>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (...args: P) => {
    setLoading(true);
    try {
      const response = await fetchApi(...args);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(...params);
  }, dependencies);

  return { data, loading, error };
}
