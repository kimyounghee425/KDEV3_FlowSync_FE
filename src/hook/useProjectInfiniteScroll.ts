import { useEffect, useState, useRef, useCallback } from "react";
import { fetchProjectList } from "@/src/api/projects";
import { ProjectProps } from "@/src/types";

/**
 * 프로젝트 목록을 무한 스크롤 방식으로 가져오는 커스텀 훅
 *
 * @param {string} status - "COMPLETED" | "INPROGRESS" (프로젝트 진행 상태)
 * @param {number} prefetchPages - 미리 불러올 페이지 수 (기본값: 2)
 *
 * @returns {object} 프로젝트 목록, 로딩 상태, 추가 데이터 존재 여부, 감지할 요소 ref
 */
export function useProjectInfiniteScroll(status: string, prefetchPages = 2) {
  const [projectList, setProjectList] = useState<ProjectProps[]>([]);
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
      if (!hasMore || loading) return;

      setLoading(true);
      try {
        const response = await fetchProjectList("", status, page, 8);
        const newProjects = response.data.projects;

        if (!newProjects || newProjects.length === 0) {
          setHasMore(false); // 패칭 결과가 없으면 더 이상 요청하지 않음
          return;
        }

        setProjectList((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewProjects = newProjects.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...uniqueNewProjects];
        });

        setCurrentPage((prev) => prev + 1); // 성공 시에만 페이지 증가
      } catch (error) {
        console.error("Error fetching more projects:", error);
        setHasMore(false); // 패칭 실패 시 더 이상 요청하지 않음
      } finally {
        setLoading(false);
      }
    },
    [status, hasMore, loading],
  );

  /**
   * `status` 변경 시 데이터 초기화
   */
  useEffect(() => {
    setProjectList([]); // 기존 데이터 초기화
    setCurrentPage(1);
    setHasMore(true);
  }, [status]);

  /**
   * 📌 첫 로딩 시 미리 데이터를 가져오는 함수
   */
  useEffect(() => {
    const prefetchPagesArray = Array.from(
      { length: prefetchPages },
      (_, i) => i + 1,
    );

    (async () => {
      setLoading(true);
      try {
        const responses = await Promise.all(
          prefetchPagesArray.map((page) =>
            fetchProjectList("", status, page, 8),
          ),
        );
        const allProjects = responses.flatMap((res) => res.data.projects);

        if (allProjects.length === 0) {
          setHasMore(false); // 첫 로딩에도 데이터가 없으면 더 이상 요청하지 않음
          return;
        }

        setProjectList((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueProjects = allProjects.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...uniqueProjects];
        });

        setCurrentPage(prefetchPages + 1);
      } catch (error) {
        console.error("Error prefetching projects:", error);
        setHasMore(false); // 패칭 실패 시 무한 요청 방지
      } finally {
        setLoading(false);
      }
    })();

    setCurrentPage(prefetchPages + 1);
  }, [status]);

  /**
   *  Intersection Observer를 활용한 무한 스크롤 감지
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchMoreProjects(currentPage);
        }
      },
      { threshold: 0.6 },
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [fetchMoreProjects, loading, currentPage]);

  return { projectList, loading, hasMore, observerRef };
}
