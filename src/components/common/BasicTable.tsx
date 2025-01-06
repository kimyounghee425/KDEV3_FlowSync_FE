"use client";

import { useEffect, useState } from "react";
import { Stack, Table } from "@chakra-ui/react";
import Pagination from "./Pagination";
import { fetchProjects } from "@/src/api/projects";
import { ProjectProps, BoardResponse } from "@/src/types";

interface BasicTableProps {
  headerTitle: React.ReactNode;
}

const BasicTable: React.FC<BasicTableProps> = ({ headerTitle }) => {
  const [data, setData] = useState<ProjectProps[]>([]); // 프로젝트 데이터 타입 지정
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalCount, setTotalCount] = useState(0); // 전체 데이터 개수
  const [pageSize] = useState(10); // 한 페이지당 데이터 개수
  const [loading, setLoading] = useState(true); // 로딩 상태

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      // API 호출 및 데이터 업데이트
      const response: BoardResponse<ProjectProps> = await fetchProjects(
        page - 1, // 0-indexed
        pageSize
      );
      setData(response.data);
      setCurrentPage(response.meta.currentPage + 1); // 1-indexed
      setTotalCount(response.meta.totalElements);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // 페이지 변경 처리
  };

  return (
    <Stack width="full" gap="5">
      <Table.Root size="sm" interactive>
        <Table.Header>{headerTitle}</Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={7} textAlign="center">
                Loading...
              </Table.Cell>
            </Table.Row>
          ) : (
            data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.projectName}</Table.Cell>
                <Table.Cell>{item.client}</Table.Cell>
                <Table.Cell>{item.developer}</Table.Cell>
                <Table.Cell>{item.contractStage}</Table.Cell>
                <Table.Cell>{item.progressStage}</Table.Cell>
                <Table.Cell>{item.startDate}</Table.Cell>
                <Table.Cell textAlign="end">{item.endDate}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </Stack>
  );
};

export default BasicTable;
