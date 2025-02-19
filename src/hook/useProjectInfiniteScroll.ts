"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { fetchProjectListSidebarApi } from "@/src/api/projects";
import { ProjectSidebarProps } from "@/src/types";

/**
 * 프로젝트 목록을 무한 스크롤 방식으로 가져오는 커스텀 훅
 *
 * @param {string} managementStep - "COMPLETED" | "INPROGRESS" | "CONTRACT" (프로젝트 진행 상태)
 *
 * @returns {object} 프로젝트 목록, 로딩 상태, 추가 데이터 존재 여부, 감지할 요소 ref
 */
export function useProjectInfiniteScroll(managementStep: string) {
  const [projectList, setProjectList] = useState<ProjectSidebarProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  
  /**
   * 새로운 프로젝트 데이터를 불러와 기존 목록에 추가하는 함수
   *
   * @param {number} page - 가져올 페이지 번호
   */
  const fetchMoreProjects = useCallback(
    async (page: number) => {
      if (!managementStep || !hasMore || loading) return;
      setLoading(true);

      try {
        const response = await fetchProjectListSidebarApi(
          managementStep,
          page,
          20,
        );
        const newProjects = response.data.projects;

        if (!newProjects || newProjects.length === 0) {
          setHasMore(false); // 더 이상 데이터가 없으면 중단
          return;
        }

        setProjectList((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewProjects = newProjects.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...uniqueNewProjects];
        });

        setCurrentPage((prev) => prev + 1);
      } catch (error) {
        console.error("Error fetching more projects:", error);
        setHasMore(false); // 오류 발생 시 무한 요청 방지
      } finally {
        setLoading(false);
      }
    },
    [managementStep, hasMore, loading],
  );

  /**
   * `managementStep` 변경 시 데이터 초기화
   */
  useEffect(() => {
    // managementStep가 빈 문자열이면 초기화만 하고 API 호출 안 함
    if (!managementStep) {
      setProjectList([]);
      setLoading(false);
      setHasMore(true);
      return;
    }

    setProjectList([]); // 기존 데이터 초기화
    setCurrentPage(1);
    setHasMore(true);

    fetchMoreProjects(1);
  }, [managementStep]);

  /**
   *  Intersection Observer를 활용한 무한 스크롤 감지
   */
  useEffect(() => {
    if (!managementStep) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchMoreProjects(currentPage);
        }
      },
      { threshold: 1.0 },
    );

    const observerElement = observerRef.current;
    if (observerElement) observer.observe(observerElement);

    return () => {
      if (observerElement) observer.unobserve(observerElement); // ✅ 기존 observer 정리
    };
  }, [fetchMoreProjects, loading, currentPage, hasMore]);

  return { projectList, loading, hasMore, observerRef };
}
