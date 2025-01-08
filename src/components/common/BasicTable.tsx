"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Box, Heading, Stack, Table } from "@chakra-ui/react";
import Pagination from "./Pagination";
import { fetchProjects } from "@/src/api/projects";
import { ProjectProps, BoardResponse, PaginationMeta } from "@/src/types";
import { Loading } from "./Loading";
import { CustomBox } from "./CustomBox";
import { useRouter } from "next/navigation";
import SearchSection from "./SearchSection";
import { getTranslatedStatus } from "@/src/utils/getTranslatedStatus";

interface BasicTableProps {
  headerTitle: React.ReactNode;
}

const BasicTable: React.FC<BasicTableProps> = ({ headerTitle }) => {
  const [data, setData] = useState<ProjectProps[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState<string>(""); // 검색어 상태
  const [filter, setFilter] = useState<string>(""); // 필터링 상태

  // 최신 상태 값을 참조하기 위한 useRef
  const queryRef = useRef(query);
  const filterRef = useRef(filter);

  // query와 filter가 변경될 때 useRef 업데이트
  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  const router = useRouter();

  const fetchData = useCallback(async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response: BoardResponse<ProjectProps> = await fetchProjects(
        page - 1, // 서버에서 0-indexed 페이지를 사용
        pageSize,
        queryRef.current,
        filterRef.current
      );
      setData(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!meta) {
      // 초기 로드 시 데이터 가져오기
      fetchData(1, 5);
    }
  }, [meta, fetchData]);

  const handlePageChange = (page: number) => {
    if (meta) {
      // 페이지 변경 시 새로운 데이터를 가져오기
      fetchData(page, meta.pageSize || 5);
      setMeta((prev) => ({ ...prev!, currentPage: page - 1 }));
    }
  };

  const handleSearch = (newQuery: string, newFilter: string) => {
    if (newQuery !== query) {
      setQuery(newQuery);
    }
    if (newFilter !== filter) {
      setFilter(newFilter);
    }
    fetchData(1, 5);
  };

  const handleRowClick = (id: number) => {
    router.push(`/projects/${id}`);
  };

  return (
    <Stack width="full" gap="5">
      <Heading size="2xl" color="gray.700">
        프로젝트 목록
      </Heading>
      <SearchSection
        query={query}
        filter={filter}
        onQueryChange={setQuery}
        onFilterChange={setFilter}
        onSearch={handleSearch}
      />
      <Table.Root size="sm" interactive>
        <Table.Header>{headerTitle}</Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={7} textAlign="center">
                <Loading />
              </Table.Cell>
            </Table.Row>
          ) : (
            data.map((item) => (
              <Table.Row
                key={item.id}
                onClick={() => handleRowClick(item.id)}
                css={{
                  "& > td": {
                    textAlign: "center",
                  },
                }}
              >
                <Table.Cell>{item.projectName}</Table.Cell>
                <Table.Cell>{item.client}</Table.Cell>
                <Table.Cell>{item.developer}</Table.Cell>
                <Table.Cell>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CustomBox>
                      {getTranslatedStatus(item.projectStatus)}
                    </CustomBox>
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CustomBox>{item.progressStepName}</CustomBox>
                  </Box>
                </Table.Cell>
                <Table.Cell>{item.startAt}</Table.Cell>
                <Table.Cell textAlign="end">{item.closeAt}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

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
