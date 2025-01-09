"use client";

import { useEffect, useState, ReactNode } from "react";
import { Heading, Stack, Table } from "@chakra-ui/react";
import Pagination from "./Pagination";
import { fetchProjects } from "@/src/api/projects";
import { ProjectProps, BoardResponse, PaginationMeta } from "@/src/types";
import { Loading } from "./Loading";
import { CustomBox } from "./CustomBox";
import { useRouter } from "next/navigation";
import SearchSection from "./SearchSection";
import { getTranslatedStatus } from "@/src/utils/getTranslatedStatus";
import { useFilter } from "@/src/context/ProjectsFilterContext";

interface BasicTableProps {
  headerTitle: ReactNode;
}

const BasicTable: React.FC<BasicTableProps> = ({ headerTitle }) => {
  const [data, setData] = useState<ProjectProps[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState<string>(""); // 검색어 상태

  const { filter, setFilter } = useFilter();

  const router = useRouter();

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
  }, [filter]);

  const handlePageChange = (page: number) => {
    // 페이지 변경 시 새로운 데이터를 가져오기
    fetchData(query, page, meta?.pageSize || 5);
  };

  // 검색어와 필터 상태값 초기화 함수
  const reset = () => {
    setQuery("");
    setFilter("all");
  };

  // 최신 query 값을 매개변수로 받아 사용
  const onSubmit = () => {
    fetchData(query);
  };

  const handleRowClick = (id: number) => {
    router.push(`/projects/${id}`);
  };

  return (
    <Stack width="full">
      <Heading size="2xl" color="gray.600">
        프로젝트 목록
      </Heading>
      <SearchSection
        query={query}
        setQuery={setQuery}
        onSubmit={onSubmit}
        reset={reset}
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
                    height: "55px",
                    fontSize: "md",
                  },
                }}
              >
                <Table.Cell>{item.projectName}</Table.Cell>
                <Table.Cell>{item.client}</Table.Cell>
                <Table.Cell>{item.developer}</Table.Cell>
                <Table.Cell>
                  <CustomBox>
                    {getTranslatedStatus(item.projectStatus)}
                  </CustomBox>
                </Table.Cell>
                <Table.Cell>
                  <CustomBox>{item.progressStepName}</CustomBox>
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
