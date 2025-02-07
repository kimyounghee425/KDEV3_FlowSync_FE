import { useEffect, useState } from "react";
import { CommonResponseWithMetaType, PaginationProps, ProjectQuestionListResponse } from "@/src/types";
import { fetchProjectQuestionList as fetchProjectQuestionListApi } from "@/src/api/projects";

interface UseFetchBoardListProps<T, P extends any[], K extends keyof T> {
  fetchApi: (...args: P) => Promise<CommonResponseWithMetaType<T>>;
  keySelector: K;
  params?: P;
}
/**
 * 게시판 목록 데이터를 가져오는 커스텀 훅.
 * - 데이터를 가져오고 상태를 관리합니다.
 *
 * @template T - 응답 데이터 타입
 * @template P - API 함수의 매개변수 타입
 * @template K - data안에 meta와 함께 전달되는 키 타입
 *
 * @param {UseFetchBoardListProps<T, P, K>} props 훅에 필요한 속성들
 * @returns 데이터, 페이지네이션 정보, 로딩 상태, 에러 메시지
 */
export function useFetchBoardList<T, P extends any[], K extends keyof T>({
  fetchApi,
  keySelector,
  params = [] as unknown as P,
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
  }, [...params]);

  return { data, paginationInfo, loading, error };
}

// ProjectQuestionList 데이터 패칭
export const useProjectQuestionList = (
  resolvedProjectId: string,
  keyword: string,
  progressStep: string,
  status: string,
  currentPage: number,
  pageSize: number
) => useFetchBoardList<
  ProjectQuestionListResponse,
  [string, string, string, string, number, number],
  "projectQuestions"
>({
  fetchApi: fetchProjectQuestionListApi,
  keySelector: "projectQuestions",
  params: [
    resolvedProjectId,
    keyword,
    progressStep,
    status,
    currentPage,
    pageSize,
  ],
});