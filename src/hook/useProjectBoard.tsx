"use client";

import { useParams, useSearchParams } from "next/navigation";
import { BoardResponse, PaginationInfo, ProjectProps } from "../types";
import { useCallback, useEffect, useState } from "react";
import { fetchProjectBoard } from "../api/projects";
import { ProjectPost } from "../types";

export function useProjectBoard() {
  const searchParams = useSearchParams(); // URL 쿼리스트링 추출
  const { projectId } = useParams(); // 동적 경로 추출

  const [boardList, setBoardList] = useState<ProjectPost[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>();
  const [loading, setLoading] = useState(false);

  const keyword = searchParams.get("keyword") || "";
  const boardCategory = searchParams.get("boardCategory") || "";
  const boardStatus = searchParams.get("boardStatus") || "";

  const fetchBoardList = useCallback(
    async (currentPage: number = 1, pageSize: number = 5) => {
      setLoading(true);
      try {
        const response: BoardResponse<ProjectPost> = await fetchProjectBoard(
          projectId as string,
          keyword,
          boardStatus,
          boardCategory,
          currentPage - 1,
          pageSize
        );
        setBoardList(response.data);
        setPaginationInfo(response.meta);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [projectId, keyword, boardStatus, boardCategory]
  );

  useEffect(() => {
    fetchBoardList();
  }, [fetchBoardList]);

  return {
    keyword,
    boardStatus,
    boardCategory,
    boardList,
    paginationInfo,
    loading,
    fetchBoardList,
  };
}
