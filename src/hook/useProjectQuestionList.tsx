"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { fetchProjectQuestionList } from "@/src/api/projects";
import {
  CommonResponseType,
  ProjectQuestionProps,
  ProjectQuestionListResponse,
  PaginationProps,
} from "@/src/types";

interface useProjectQuestionListProps {
  projectId?: string;
  taskId?: string;
}

/**
 * 프로젝트 질문관리 게시판 데이터패칭 훅
 */
export function useProjectQuestionList() {
  const searchParams = useSearchParams();
  const { projectId, taskId } = useParams() as useProjectQuestionListProps;

  const [projectQuestionList, setProjectQuestionList] = useState<
    ProjectQuestionProps[]
  >([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationProps>();
  const [loading, setLoading] = useState(false);

  const keyword = searchParams?.get("keyword") || "";
  const status = (searchParams?.get("status") ?? "") as string;
  const progressStep = searchParams?.get("progressStep") || "";

  /**
   * 게시판 목록 데이터를 가져오는 함수
   * @param currentPage 현재 페이지 (기본값: 1)
   * @param pageSize 페이지 크기 (기본값: 5)
   */
  const fetchBoardList = useCallback(
    async (currentPage: number = 1, pageSize: number = 5) => {
      setLoading(true);
      try {
        // 서버에서 데이터 요청 (검색어, 진행 단계, 게시글 상태, 등)
        // currentPage - 1 : 0-based 페이지 인덱스 사용
        const response: CommonResponseType<ProjectQuestionListResponse> =
          await fetchProjectQuestionList(
            projectId as string,
            keyword,
            progressStep,
            status,
            currentPage - 1,
            pageSize,
          );

        // 응답 데이터에서 게시판 목록, 페이지네이션 정보 추출
        setProjectQuestionList(response.data.projectQuestions);
        setPaginationInfo(response.data.meta);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [projectId, keyword, progressStep, status],
  );

  useEffect(() => {
    fetchBoardList();
  }, [fetchBoardList]);

  return {
    keyword, // 검색/필터를 위한 쿼리 파라미터
    progressStep, // 진행 단계
    status, // 글 상태

    projectQuestionList, // 게시글 목록

    paginationInfo, // 페이지네이션 정보
    loading,

    projectId, // URL 경로에서 추출한 프로젝트 ID, 태스크 ID
    taskId,

    fetchBoardList, // 게시글 목록 재조회 함수
  };
}
