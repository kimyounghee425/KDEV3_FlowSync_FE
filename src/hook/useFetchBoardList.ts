import { useEffect, useState } from "react";
import { CommonResponseWithMetaType, PaginationProps, ProjectQuestionListResponse, ProjectApprovalListResponse, ProjectListResponse, NoticeListResponse, OrganizationListResponse, MemberListResponse } from "@/src/types";
import { fetchProjectQuestionListApi, fetchProjectApprovalListApi, fetchProjectListApi } from "@/src/api/projects";
import { showToast } from "@/src/utils/showToast";
import { fetchNoticeListApi } from "@/src/api/notices";
import { fetchOrganizationListApi } from "@/src/api/organizations";
import { fetchMemberListApi } from "@/src/api/members";

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
      // ✅ 서버 응답에서 message 필드가 있는 경우 해당 메시지 사용
      const errorMessage = err.response?.data?.message || err.message || "데이터를 불러오는 중 오류가 발생했습니다.";
      
      // ✅ 토스트로 사용자에게 알림
      showToast({
        title: "요청 실패",
        description: errorMessage,
        type: "error",
        duration: 3000,
        error: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardListData(...params);
  }, [...params]);

  return { data, paginationInfo, loading, error, refetch: () => fetchBoardListData(...params) };
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

// ProjectTaskList 데이터 패칭
export const useProjectApprovalList = (
  resolvedProjectId: string,
  keyword: string,
  progressStep: string,
  status: string,
  currentPage: number,
  pageSize: number
) => useFetchBoardList<
  ProjectApprovalListResponse,
  [string, string, string, string, number, number],
  "projectApprovals"
>({
  fetchApi: fetchProjectApprovalListApi,
  keySelector: "projectApprovals",
  params: [
    resolvedProjectId,
    keyword,
    progressStep,
    status,
    currentPage,
    pageSize,
  ],
});

// 프로젝트 목록 패칭
export const useProjectList = (
  keyword: string,
  status: string,
  currentPage: number,
  pageSize: number
) => useFetchBoardList<
ProjectListResponse,
[string, string, number, number],
"projects"
>({
fetchApi: fetchProjectListApi,
keySelector: "projects",
params: [keyword, status, currentPage, pageSize],
});

// 공지사항 목록 패칭
export const useNoticeList = (
  keyword: string,
  category: string,
  isDeleted: string,
  currentPage: number,
  pageSize: number
) => useFetchBoardList<
NoticeListResponse,
[string, string, string, number, number],
"notices"
>({
fetchApi: fetchNoticeListApi,
keySelector: "notices",
params: [keyword, category, isDeleted, currentPage, pageSize],
});

// 회원 목록 패칭
export const useMemberList = (
  keyword: string,
  role: string,
  status: string,
  currentPage: number,
  pageSize: number
) => 
useFetchBoardList<
    MemberListResponse,
    [string, string, string, number, number],
    "members"
  >({
    fetchApi: fetchMemberListApi,
    keySelector: "members",
    params: [keyword, role, status, currentPage, pageSize],
  });

// 업체 목록 패칭
export const useOrganizationList = (
  keyword: string,
  type: string,
  status: string,
  currentPage: number,
  pageSize: number
) => 
useFetchBoardList<
    OrganizationListResponse,
    [string, string, string, number, number],
    "dtoList"
  >({
    fetchApi: fetchOrganizationListApi,
    keySelector: "dtoList",
    params: [keyword, type, status, currentPage, pageSize],
  });