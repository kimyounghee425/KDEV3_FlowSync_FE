"use client";

import { useEffect, useState, useCallback } from "react";
import { Stack, Table } from "@chakra-ui/react";
import Pagination from "./Pagination";
import { fetchProjects } from "@/src/api/projects";
import { ProjectProps, BoardResponse, PaginationMeta } from "@/src/types";

interface BasicTableProps {
  headerTitle: React.ReactNode;
}

const BasicTable: React.FC<BasicTableProps> = ({ headerTitle }) => {
  const [data, setData] = useState<ProjectProps[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const response: BoardResponse<ProjectProps> = await fetchProjects(
          page - 1, // 서버에서 0-indexed 페이지를 사용
          meta?.pageSize || 10
        );
        setData(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [meta?.pageSize]
  );

  useEffect(() => {
    fetchData(meta?.currentPage ? meta.currentPage + 1 : 1); // 초기 로드 또는 페이지 변경 시 데이터 가져오기
  }, [meta?.currentPage, fetchData]);

  const handlePageChange = (page: number) => {
    if (meta) {
      setMeta({ ...meta, currentPage: page - 1 }); // 페이지 변경
    }
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
