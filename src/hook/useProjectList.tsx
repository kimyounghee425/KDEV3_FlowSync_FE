import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProjectList } from "@/src/api/projects";
import {
  CommonResponseType,
  PaginationProps,
  ProjectListResponse,
  ProjectProps,
} from "@/src/types";

export function useProjectList() {
  const searchParams = useSearchParams();

  const [projectList, setProjectList] = useState<ProjectProps[]>([]);

  const [paginationInfo, setPaginationInfo] = useState<PaginationProps>();

  const [loading, setLoading] = useState(false);

  const keyword = searchParams?.get("keyword") || "";
  const status = searchParams?.get("status") || "";

  /**
   * 서버에서 프로젝트 목록을 가져오는 함수
   * @param currentPage 현재 페이지 (기본값: 1)
   * @param pageSize 페이지 크기 (기본값: 5)
   */
  const fetchBoardList = useCallback(
    async (currentPage: number = 1, pageSize: number = 5) => {
      setLoading(true);
      try {
        const response: CommonResponseType<ProjectListResponse> =
          await fetchProjectList(keyword, status, currentPage - 1, pageSize);

        setProjectList(response.data.projects);
        setPaginationInfo(response.data.meta);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [keyword, status],
  );

  /**
   * 컴포넌트 마운트 시 (또는 쿼리 파라미터가 변경될 때) 프로젝트 목록을 가져옴
   */
  useEffect(() => {
    fetchBoardList();
  }, []);

  return {
    // 검색어, 프로젝트 상태(쿼리 파라미터)
    keyword,
    status,
    // 프로젝트 목록
    projectList,
    // 페이지네이션 정보
    paginationInfo,
    // 로딩 여부
    loading,
    // 직접 페이지를 다시 불러올 때 사용할 수 있는 메서드
    fetchBoardList,
  };
}
