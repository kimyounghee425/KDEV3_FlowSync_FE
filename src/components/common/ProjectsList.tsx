"use client";

import { useEffect, useState, ReactNode, useCallback } from "react";
import { Stack } from "@chakra-ui/react";
import Pagination from "./Pagination";
import { fetchProjects } from "@/src/api/projects";
import { ProjectProps, BoardResponse, PaginationMeta } from "@/src/types";

import SearchSection from "./SearchSection";
import { useFilter } from "@/src/context/ProjectsFilterContext";
import CustomTable from "./CustomTable";

interface BasicTableProps {
  headerTitle: ReactNode;
}

const BasicTable: React.FC<BasicTableProps> = ({ headerTitle }) => {
  const [data, setData] = useState<ProjectProps[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState<string>(""); // 쿼리용 상태
  const [input, setInput] = useState(""); // 실시간 검색어 상태

  const { filter, setFilter } = useFilter();

  const fetchData = async (
    queryValue: string,
    page: number = 1,
    pageSize: number = 5
  ) => {
    setLoading(true);
    try {
      const response: BoardResponse<ProjectProps> = await fetchProjects(
        queryValue,
        filter,
        page - 1, // 서버에서 0-indexed 페이지를 사용
        pageSize
      );
      setData(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchData(query);
  }, [query, filter]);

  const handlePageChange = (page: number) => {
    // 페이지 변경 시 새로운 데이터를 가져오기
    fetchData(query, page, meta?.pageSize || 5);
  };

  // 검색어와 필터 상태값 초기화 함수
  const reset = useCallback(() => {
    setQuery("");
    setInput("");
    setFilter("all");
  }, [setQuery, setFilter]);

  const onSubmit = useCallback(() => {
    if (!input || query === input) return;
    fetchData(query);
  }, [query, filter]);

  return (
    <Stack width="full">
      <SearchSection
        input={input}
        setInput={setInput}
        setQuery={setQuery}
        onSubmit={onSubmit}
        reset={reset}
      />
      <CustomTable headerTitle={headerTitle} loading={loading} data={data} />

      {meta && (
        <Pagination
          meta={{
            ...meta,
            currentPage: meta.currentPage + 1, // 1-indexed로 변환
          }}
          onPageChange={handlePageChange}
        />
      )}
    </Stack>
  );
};

export default BasicTable;
