"use client";

import { useParams, useSearchParams } from "next/navigation";
import { BoardResponseType, PaginationInfoType } from "../types";
import { useCallback, useEffect, useState } from "react";
import { fetchProjectBoard } from "../api/projects";
import { ProjectPostType } from "../types";

export function useProjectBoard() {
  const searchParams = useSearchParams(); // URL 쿼리스트링 추출
  const { projectId, taskId } = useParams(); // 동적 경로 추출

  const [boardList, setBoardList] = useState<ProjectPostType[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfoType>();
  const [loading, setLoading] = useState(false);

  const keyword = searchParams.get("keyword") || "";
  const boardCategory = searchParams.get("boardCategory") || "";
  const boardStatus = searchParams.get("boardStatus") || "";
  const progressStep = searchParams.get("progressStep") || "";

  const fetchBoardList = useCallback(
    async (currentPage: number = 1, pageSize: number = 5) => {
      setLoading(true);
      try {
        const response: BoardResponseType<ProjectPostType> =
          await fetchProjectBoard(
            projectId as string,
            keyword,
            progressStep,
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
    [projectId, keyword, progressStep, boardStatus, boardCategory]
  );

  useEffect(() => {
    fetchBoardList();
  }, [fetchBoardList]);

  return {
    keyword,
    progressStep,
    boardStatus,
    boardCategory,
    boardList,
    paginationInfo,
    loading,
    projectId,
    taskId,
    fetchBoardList,
  };
}
