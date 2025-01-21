"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { BoardResponseProps, PaginationProps } from "@/src/types";
import { fetchProjectBoard } from "@/src/api/projects";
import { ProjectPostProps } from "@/src/types";

interface ProjectBoardParamsProps {
  projectId?: string;
  taskId?: string;
}

/**
 * 프로젝트 게시판 훅
 * - URL 경로(프로젝트 ID, 태스크 ID) 및 쿼리 파라미터(검색어, 상태 등)를 추출
 * - 서버 API fetchProjectBoard를 통해 게시판 목록과 페이지네이션 정보 로드
 * - 로딩 상태(loading), 리스트/페이지 정보, 재조회 함수 등을 반환
 */
export function useProjectBoard() {
  const searchParams = useSearchParams(); // URL 쿼리스트링 추출
  const { projectId, taskId } = useParams() as ProjectBoardParamsProps;

  // 게시판(프로젝트 게시글) 목록 상태
  const [boardList, setBoardList] = useState<ProjectPostProps[]>([]);
  // 페이지네이션 관련 정보(현재 페이지, 전체 페이지, 페이지 크기 등)
  const [paginationInfo, setPaginationInfo] = useState<PaginationProps>();
  // 로딩 여부
  const [loading, setLoading] = useState(false);

  // 쿼리 파라미터(검색어, 게시글 상태, 진행 단계, 등)
  const keyword = searchParams?.get("keyword") || "";
  const boardCategory = searchParams?.get("boardCategory") || "";
  const boardStatus = searchParams?.get("boardStatus") || "";
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
        const response: BoardResponseProps<ProjectPostProps> =
          await fetchProjectBoard(
            projectId as string,
            keyword,
            progressStep,
            boardStatus,
            boardCategory,
            currentPage - 1,
            pageSize,
          );

        // 응답 데이터에서 게시판 목록, 페이지네이션 정보 추출
        setBoardList(response.data);
        setPaginationInfo(response.meta);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [projectId, keyword, progressStep, boardStatus, boardCategory],
  );

  useEffect(() => {
    fetchBoardList();
  }, [fetchBoardList]);

  return {
    // 검색/필터를 위한 쿼리 파라미터
    keyword,
    progressStep,
    boardStatus,
    boardCategory,
    // 게시글 목록
    boardList,
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
