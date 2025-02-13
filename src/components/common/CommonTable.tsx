"use client";

import { ReactNode } from "react";
import { Box, Table } from "@chakra-ui/react";
import { SkeletonText } from "@/src/components/ui/skeleton";

interface CommonTableProps<T> {
  headerTitle: ReactNode;
  data: T[] | null;
  loading: boolean;
  renderRow: (item: T, index?: number) => ReactNode;
}

export default function CommonTable<T extends { id: string }>({
  headerTitle,
  data = [],
  loading,
  renderRow,
}: CommonTableProps<T>) {
  // 반응형 스타일 값

  return (
    <Box
      overflowX="auto" // ✅ 테이블이 넘칠 경우 가로 스크롤 활성화
      whiteSpace="nowrap" // ✅ 텍스트 줄바꿈 방지
      css={{
        "&::-webkit-scrollbar": { height: "8px" },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
      }}
    >
      <Table.Root
        size="sm"
        width="100%"
        minWidth="600px" // 최소 크기 설정
        maxWidth="none" // 너비 제한 없음
        css={{
          borderCollapse: "collapse",
          // "& th, & td": { border: "1.8px solid #ddd", padding: "8px" },
          "& th, & td": { padding: "8px" },
          "& th": { padding: "16px" },
        }}
      >
        {/* 테이블 헤더 */}
        <Table.Header
          css={{
            "& th": {
              textAlign: "center",
              fontWeight: "bold",
            },
          }}
        >
          {headerTitle}
        </Table.Header>

        {/* 테이블 바디 */}
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={7} textAlign="center">
                <SkeletonText noOfLines={5} gap="4" />
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
