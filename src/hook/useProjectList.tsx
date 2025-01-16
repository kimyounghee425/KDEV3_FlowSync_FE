import { useSearchParams } from "next/navigation";
import {
  BoardResponseType,
  PaginationInfoType,
  ProjectPropsType,
} from "../types";
import { useCallback, useEffect, useState } from "react";
import { fetchProjects } from "../api/projects";

export function useProjectList() {
  const searchParams = useSearchParams();
  const [projectList, setProjectList] = useState<ProjectPropsType[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfoType>();
  const [loading, setLoading] = useState(false);
  const keyword = searchParams.get("keyword") || "";
  const filter = searchParams.get("filter") || "";

  const fetchProjectList = useCallback(
    async (currentPage: number = 1, pageSize: number = 5) => {
      setLoading(true);
      try {
        const response: BoardResponseType<ProjectPropsType> =
          await fetchProjects(keyword, filter, currentPage - 1, pageSize);
        setProjectList(response.data);
        setPaginationInfo(response.meta);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [keyword, filter]
  );

  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);

  return {
    keyword,
    filter,
    projectList,
    paginationInfo,
    loading,
    fetchProjectList,
  };
}
