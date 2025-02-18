import { useEffect, useState } from "react";
import { CommonResponseType, ManagementStepCountMap, NoticeArticle, ProgressStep, ProjectInfoProps, ProjectProgressStepProps, UserInfoResponse,  } from "@/src/types";
import { fetchProjectApprovalProgressStepApi, fetchProjectInfoApi, fetchProjectProgressStepApi, fetchProjectQuestionProgressStepApi, fetchProjectsManagementStepsCountApi, projectProgressStepApi } from "@/src/api/projects";
import { showToast } from "@/src/utils/showToast";
import { fetchUserInfoApi } from "@/src/api/auth";
import { readNoticeApi } from "@/src/api/ReadArticle";

interface UseFetchDataProps<T, P extends any[]> {
  fetchApi: (...args: P) => Promise<CommonResponseType<T>>;
  params?: P;
}

/**
 * 데이터를 가져오고 상태를 관리하는 커스텀 훅.
 * - 데이터 요청 및 로딩 상태, 에러 상태를 관리합니다.
 *
 * @template T - 응답 데이터 타입
 * @template P - API 함수의 매개변수 타입
 *
 * @param {UseFetchDataProps<T, P>} props 훅에 필요한 속성들
 * @returns 데이터, 로딩 상태, 에러 메시지
 */
export function useFetchData<T, P extends any[]>({
  fetchApi,
  params = [] as unknown as P,
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
      const errorMessage = err.response?.data?.message || err.message || "데이터를 불러오는데 실패했습니다.";
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
    fetchData(...params);
  }, [...params]);

  return { data, loading, error, refetch: () => fetchData(...params) };
}

/**
 * 프로젝트 질문 Progress Step 데이터 패칭 훅
 */
export const useProjectQuestionProgressStepData = (projectId: string) =>
  useFetchData<ProjectProgressStepProps[], [string]>({
    fetchApi: fetchProjectQuestionProgressStepApi,
    params: [projectId],
  });

/**
 * 프로젝트 정보 데이터 패칭 훅
 */
export const useProjectInfo = (projectId: string) =>
  useFetchData<ProjectInfoProps, [string]>({
    fetchApi: fetchProjectInfoApi,
    params: [projectId],
  });

/**
 * 결재 Progress Step 데이터 패칭 훅
 */
export const useProjectApprovalProgressStepData = (projectId: string) =>
  useFetchData<ProjectProgressStepProps[], [string]>({
    fetchApi: fetchProjectApprovalProgressStepApi,
    params: [projectId],
  });

/**
 *  유저 정보 패칭 훅
 */
export const useUserInfo = () => useFetchData<UserInfoResponse, []>({
  fetchApi: fetchUserInfoApi,
  params: []
});

/**
 * 공지사항 조회 훅
 */
export function useReadNotice(noticeId: string) {
  return useFetchData<NoticeArticle, [string]>({
    fetchApi: readNoticeApi,
    params: [noticeId],
  });
}

export function useManagementStepsCount() {
  return useFetchData<{
    managementStepCountMap: ManagementStepCountMap;
  }, []> ({
    fetchApi: fetchProjectsManagementStepsCountApi,
    params: []
  })
}

/**
 * 진척관리 진행단계 요약 데이터 패칭 훅
 */
export const useProjectProgressStepData = (projectId: string) =>
  useFetchData<ProgressStep[], [string]>({
    fetchApi: projectProgressStepApi,
    params: [projectId],
  });

  /**
 * 특정 프로젝트 진행 단계 상세 정보 패칭 훅
 */
export const useProjectProgressStepDetail = (projectId: string, progressStepId: string) =>
  useFetchData<ProgressStep, [string, string]>({
    fetchApi: fetchProjectProgressStepApi,
    params: [projectId, progressStepId],
  });

  