import { useEffect, useState } from "react";
import { CommonResponseWithMetaType, PaginationProps } from "@/src/types";

interface UseFetchBoardListProps<T, P extends any[], K extends keyof T> {
  fetchApi: (...args: P) => Promise<CommonResponseWithMetaType<T>>;
  keySelector: K;
  params?: P;
  dependencies?: any[];
}

export function useFetchBoardList<T, P extends any[], K extends keyof T>({
  fetchApi,
  keySelector,
  params = [] as unknown as P,
  dependencies = [],
}: UseFetchBoardListProps<T, P, K>) {
  const [data, setData] = useState<T[K] | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<PaginationProps>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoardListData = async (...args: P) => {
    setLoading(true);
    try {
      const response = await fetchApi(...args);
      setData(response.data[keySelector]);
      setPaginationInfo(response.data.meta as PaginationProps);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardListData(...params);
  }, dependencies);

  return { data, paginationInfo, loading, error };
}
