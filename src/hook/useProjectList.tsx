import { useSearchParams } from "next/navigation";
import { BoardResponse, PaginationInfo, ProjectProps } from "../types";
import { useCallback, useEffect, useState } from "react";
import { fetchProjects } from "../api/projects";

export function useProjectList() {
  const searchParams = useSearchParams();
  const [projectList, setProjectList] = useState<ProjectProps[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>();
  const [loading, setLoading] = useState(false);
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || "";

  const fetchProjectList = useCallback(
    async (currentPage: number = 1, pageSize: number = 5) => {
      setLoading(true);
      try {
        const response: BoardResponse<ProjectProps> = await fetchProjects(
          query,
          filter,
          currentPage - 1,
          pageSize
        );
        setProjectList(response.data);
        setPaginationInfo(response.meta);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [query, filter]
  );

  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);

  return {
    query,
    filter,
    projectList,
    paginationInfo,
    loading,
    fetchProjectList,
  };
}
