"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { BoardResponseProps, PaginationProps } from "@/src/types";
import { fetchProjectQuestionsList } from "@/src/api/projects";
import { ProjectQuestionProps } from "@/src/types";

interface useProjectQuestionsListProps {
  projectId?: string;
  taskId?: string;
}

/**
 * 프로젝트 질문관리 게시판 데이터패칭 훅
 */
export function useProjectQuestionsList() {
  const searchParams = useSearchParams(); // URL 쿼리스트링 추출
  const { projectId, taskId } = useParams() as useProjectQuestionsListProps;

  // 질문글 & 답변글 목록 상태
  const [projectQuestionsList, setProjectQuestionsList] = useState<
    ProjectQuestionProps[]
  >([]);
  // 페이지네이션 관련 정보
  const [paginationInfo, setPaginationInfo] = useState<PaginationProps>();
  // 로딩 여부
  const [loading, setLoading] = useState(false);

  // 쿼리 파라미터(검색어, 게시글 상태, 진행 단계)
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
        const response: BoardResponseProps<ProjectQuestionProps> =
          await fetchProjectQuestionsList(
            projectId as string,
            keyword,
            progressStep,
            status,
            currentPage - 1,
            pageSize,
          );

        // 응답 데이터에서 게시판 목록, 페이지네이션 정보 추출
        setProjectQuestionsList(response.data);
        setPaginationInfo(response.meta);
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
    // 검색/필터를 위한 쿼리 파라미터
    keyword,
    progressStep,
    status,
    // 게시글 목록
    projectQuestionsList,
    // 페이지네이션 정보
    paginationInfo,
    // 로딩 상태
    loading,
    // URL 경로에서 추출한 프로젝트 ID, 태스크 ID
    projectId,
    taskId,
    // 게시글 목록 재조회 함수
    fetchBoardList,
  };
}
