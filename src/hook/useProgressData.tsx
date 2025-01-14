import { useEffect, useState } from "react";
import { fetchProjectProgressCount } from "../api/projects";

interface ProgressDataType {
  id: number;
  title: string;
  count: number;
}

export function useProgressData(projectId: string) {
  const [data, setData] = useState<ProgressDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 데이터 가져오기
        const response = await fetchProjectProgressCount(projectId);
        const progressData = response.data;

        setData(progressData);
      } catch (err) {
        console.error("Failed to fetch progress data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [projectId]);

  return { data, loading, error };
}
