import axiosInstance from "@/src/api/axiosInstance";
import { CommonResponseType, ProjectListResponse } from "@/src/types";

/**
 * 프로젝트 목록을 가져옵니다.
 * @param keyword 검색어 (기본값: "")
 * @param filter 필터링 값 (기본값: "")
 * @param currentPage 현재 페이지 번호
 * @param pageSize 페이지 크기
 * @returns 프로젝트 목록 및 페이징 정보를 담은 객체(BoardResponseProps)
 */
export async function fetchProjectList(
  keyword: string = "",
  filter: string = "",
  currentPage: number,
  pageSize: number,
): Promise<CommonResponseType<ProjectListResponse>> {
  const response = await axiosInstance.get("/projects", {
    params: { keyword, filter, currentPage, pageSize },
  });
  return response.data;
}


/**
 * 특정 프로젝트의 상세 정보를 가져옵니다.
 * @param projectId 프로젝트 식별자
 * @returns 프로젝트 상세 정보
 */
export async function fetchProjectInfo(projectId: string) {
  const response = await axiosInstance.get(
    `/projects/${projectId}/projectInfo`,
  );
  return response.data;
}

/**
 * 특정 프로젝트의 진행 상황(Count)을 가져옵니다.
 * @param projectId 프로젝트 식별자
 * @returns 프로젝트 진행 상황 요약(숫자 형태)
 */
export async function fetchProjectProgressStep(projectId: string) {
  const response = await axiosInstance.get(
    `/projects/${projectId}/progressStep`,
  );
  return response.data;
}

/**
 * 전체 프로젝트 상태 요약 정보를 가져옵니다.
 * 예: 진행 중, 완료 등 상태별 프로젝트 수
 * @returns 프로젝트 상태 요약 정보
 */
export async function fetchProjectsStatusCount() {
  const response = await axiosInstance.get("/projects/status-summary");
  return response.data;
}

/**
 * 특정 프로젝트(또는 게시글) 목록(게시판)을 가져옵니다.
 * @param projectId 프로젝트 식별자
 * @param keyword 검색어 (기본값: "")
 * @param progressStep 진행 단계(필터링)
 * @param boardStatus 게시글 상태(필터링)
 * @param boardCategory 게시글 유형(필터링)
 * @param currentPage 현재 페이지
 * @param pageSize 페이지 크기
 * @returns 게시글 목록 및 페이징 정보를 담은 데이터
 */
export async function fetchProjectQuestionList(
  projectId: string,
  keyword: string = "",
  progressStep: string = "",
  status: string = "",
  currentPage: number,
  pageSize: number,
) {
  // 실제 요청은 /projects/:projectId/tasks endpoint가 될 수도 있으나,
  // 현재 주석 처리되어 있고, 대신 /posts endpoint를 사용 중입니다.
  const response = await axiosInstance.get(`/projects/${projectId}/questions`, {
    params: {
      keyword,
      progressStep,
      status,
      currentPage,
      pageSize,
    },
  });
  return response.data;
}

/**
 * 특정 프로젝트(또는 게시글) 목록(게시판)을 가져옵니다.
 * @param projectId 프로젝트 식별자
 * @param keyword 검색어 (기본값: "")
 * @param progressStep 진행 단계(필터링)
 * @param boardStatus 게시글 상태(필터링)
 * @param boardCategory 게시글 유형(필터링)
 * @param currentPage 현재 페이지
 * @param pageSize 페이지 크기
 * @returns 게시글 목록 및 페이징 정보를 담은 데이터
 */
export async function fetchProjectTaskList(
  projectId: string,
  keyword: string = "",
  progressStep: string = "",
  status: string = "",
  currentPage: number,
  pageSize: number,
) {
  // 실제 요청은 /projects/:projectId/tasks endpoint가 될 수도 있으나,
  // 현재 주석 처리되어 있고, 대신 /posts endpoint를 사용 중입니다.
  const response = await axiosInstance.get(`/posts`, {
    params: {
      keyword,
      progressStep,
      status,
      currentPage,
      pageSize,
    },
  });
  return response.data;
}