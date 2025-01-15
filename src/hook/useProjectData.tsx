import { useFetchData } from "./useFetchData";
import { fetchProjectInfo } from "@/src/api/projects";
import { useCallback, useEffect, useState } from "react";

export function useProjectData(params: Promise<{ projectId: string }>) {
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    // `params`에서 `projectId`를 한 번만 언래핑
    params.then(({ projectId }) => {
      setProjectId(projectId);
    });
  }, [params]);

  // `projectId`가 변경될 때만 새로운 fetchFunction 생성
  const fetchFunction = useCallback(() => {
    if (!projectId) return Promise.reject("Project ID is not set");
    return fetchProjectInfo(projectId).then((response) => response.data);
  }, [projectId]);

  // `useFetchData`를 사용해 데이터 패칭
  const { data, loading, error } = useFetchData(fetchFunction);

  return { data, loading, error, projectId };
}
