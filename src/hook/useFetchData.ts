import { useEffect, useState } from "react";
import { CommonResponseType, ProjectInfoProps, ProjectProgressStepProps } from "@/src/types";
import { fetchProjectApprovalProgressStepApi, fetchProjectInfoApi, fetchProjectQuestionProgressStepApi } from "@/src/api/projects";
import { showToast } from "@/src/utils/showToast";

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

  return { data, loading, error };
}

/**
 * 프로젝트 Progress Step 데이터 패칭 훅
 */
export const useProjectQuestionProgressStepData = (resolvedProjectId: string) =>
  useFetchData<ProjectProgressStepProps[], [string]>({
    fetchApi: fetchProjectQuestionProgressStepApi,
    params: [resolvedProjectId],
  });

  /**
 * 프로젝트 정보 데이터 패칭 훅
 */
export const useProjectInfo = (resolvedProjectId: string) =>
  useFetchData<ProjectInfoProps, [string]>({
    fetchApi: fetchProjectInfoApi,
    params: [resolvedProjectId],
  });

  /**
 * 결재 Progress Step 데이터 패칭 훅
 */
export const useProjectApprovalProgressStepData = (resolvedProjectId: string) =>
  useFetchData<ProjectProgressStepProps[], [string]>({
    fetchApi: fetchProjectApprovalProgressStepApi,
    params: [resolvedProjectId],
  });