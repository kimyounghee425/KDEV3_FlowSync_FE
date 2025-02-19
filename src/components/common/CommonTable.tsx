"use client";

import { ReactNode } from "react";
import { Box, Flex, Table } from "@chakra-ui/react";
import { Skeleton } from "@/src/components/ui/skeleton";

interface CommonTableProps<T> {
  columnsWidth?: ReactNode;
  headerTitle: ReactNode;
  data: T[] | null;
  loading: boolean;
  renderRow: (item: T, index?: number) => ReactNode;
  skeletonCount?: number;
  colspan?: number;
}

export default function CommonTable<T extends { id: string }>({
  columnsWidth,
  headerTitle,
  data = [],
  loading,
  renderRow,
  skeletonCount = 6,
  colspan = 8,
}: CommonTableProps<T>) {
  // 반응형 스타일 값

  return (
    <Box
      overflowX="auto" // 테이블이 넘칠 경우 가로 스크롤 활성화
      whiteSpace="nowrap" // 텍스트 줄바꿈 방지
      maxHeight=""
    >
      <Table.Root
        size="sm"
        width="100%"
        minWidth="600px" // 최소 크기 설정
        maxWidth="none" // 너비 제한 없음
        css={{
          borderCollapse: "collapse",
          tableLayout: "fixed",
          "& th, & td": { padding: "0.5rem" },
          "& th": { padding: "1rem" },
        }}
      >
        <Table.ColumnGroup>{columnsWidth}</Table.ColumnGroup>
        <Table.Header>{headerTitle}</Table.Header>
        {/* 테이블 바디 */}
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={colspan}>
                {Array.from({ length: skeletonCount }).map((_, index) => (
                  <Flex alignItems={"center"} height={"40px"} key={index}>
                    <Skeleton
                      height="20px"
                      variant="shine"
                      width="full"
                      css={{
                        "--start-color": "colors.white.100",
                        "--end-color": "colors.white.100",
                      }}
                    />
                  </Flex>
                ))}
              </Table.Cell>
            </Table.Row>
          ) : (
            data?.map((item, index) => renderRow(item, index))
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
