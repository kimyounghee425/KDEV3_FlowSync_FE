import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProjects } from "@/src/api/projects";
import { BoardResponseProps, PaginationProps, ProjectProps } from "@/src/types";

/**
 * useProjectList 훅:
 *  - 'keyword', 'projectStatus' 등 쿼리 파라미터를 통해
 *    프로젝트 목록을 서버에서 불러와 상태로 관리
 *  - 페이지네이션과 로딩 상태도 함께 처리
 */
export function useProjectList() {
  const searchParams = useSearchParams();

  // 프로젝트 목록을 저장할 상태
  const [projectList, setProjectList] = useState<ProjectProps[]>([]);

  // 페이지네이션 정보를 저장할 상태
  const [paginationInfo, setPaginationInfo] = useState<PaginationProps>();

  // 로딩 여부를 저장할 상태
  const [loading, setLoading] = useState(false);

  // URL 쿼리 스트링에서 검색어(keyword)와 프로젝트 상태(projectStatus)를 가져옴
  const keyword = searchParams?.get("keyword") || "";
  const projectStatus = searchParams?.get("projectStatus") || "";

  /**
   * 서버에서 프로젝트 목록을 가져오는 함수
   * @param currentPage 현재 페이지 (기본값: 1)
   * @param pageSize 페이지 크기 (기본값: 5)
   */
  const fetchProjectList = useCallback(
    async (currentPage: number = 1, pageSize: number = 5) => {
      setLoading(true); // 요청 시작 전 로딩 상태 true
      try {
        // fetchProjects: 서버로부터 프로젝트 목록을 가져오는 API 호출
        // currentPage - 1: 0-based 인덱스 페이지를 서버가 사용한다고 가정
        const response: BoardResponseProps<ProjectProps> = await fetchProjects(
          keyword,
          projectStatus,
          currentPage - 1,
          pageSize,
        );

        // 성공 시 응답 데이터를 상태로 저장
        setProjectList(response.data);
        setPaginationInfo(response.meta);
      } catch (error) {
        // API 호출 실패 시 에러 로그 출력
        console.error("Failed to fetch data:", error);
      } finally {
        // 요청 종료 후 로딩 상태 false
        setLoading(false);
      }
    },
    [keyword, projectStatus], // keyword, projectStatus가 바뀌면 함수를 재생성
  );

  /**
   * 컴포넌트 마운트 시 (또는 쿼리 파라미터가 변경될 때) 프로젝트 목록을 가져옴
   */
  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);

  return {
    // 검색어, 프로젝트 상태(쿼리 파라미터)
    keyword,
    projectStatus,
    // 프로젝트 목록
    projectList,
    // 페이지네이션 정보
    paginationInfo,
    // 로딩 여부
    loading,
    // 직접 페이지를 다시 불러올 때 사용할 수 있는 메서드
    fetchProjectList,
  };
}
