"use client";

import { ReactNode } from "react";
import { Box, Table, useBreakpointValue } from "@chakra-ui/react";
import { SkeletonText } from "@/src/components/ui/skeleton";

interface CommonTableProps<T> {
  headerTitle: ReactNode;
  data: T[] | null;
  loading: boolean;
  renderRow: (item: T) => ReactNode;
  handleRowClick: (id: string) => void;
  placeholderHeight?: string;
}

export default function CommonTable<T extends { id: string }>({
  headerTitle,
  data = [],
  loading,
  renderRow,
  handleRowClick,
}: CommonTableProps<T>) {
  // 반응형 스타일 값
  const fontSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const padding = useBreakpointValue({ base: "2", md: "4" });

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
        minWidth="600px" // ✅ 최소 크기 설정
        maxWidth="none" // ✅ 너비 제한 없음
        css={{
          borderCollapse: "collapse",
          "& th, & td": { border: "1px solid #ddd", padding: "8px" },
        }}
      >
        {/* ✅ 테이블 헤더 */}
        <Table.Header
          css={{
            "& th": {
              textAlign: "center",
              fontWeight: "bold",
              padding: "0.6rem",
            },
          }}
        >
          {headerTitle}
        </Table.Header>

        {/* ✅ 테이블 바디 */}
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={7} textAlign="center">
                <SkeletonText noOfLines={5} gap="4" />
              </Table.Cell>
            </Table.Row>
          ) : (
            data?.map((item) => (
              <Table.Row
                key={item.id}
                onClick={() => handleRowClick(item.id)}
                css={{
                  "&:hover": {
                    backgroundColor: "#f1f1f1", // ✅ 호버 효과 추가
                    transition: "background 0.2s ease-in-out",
                  },
                  "& > td": {
                    textAlign: "center",
                    height: "0.8rem",
                    fontSize: fontSize, // ✅ 반응형 폰트 크기
                    cursor: "pointer",
                    whiteSpace: "nowrap", // ✅ 텍스트 줄바꿈 방지
                    overflow: "hidden", // ✅ 넘치는 텍스트 숨김
                    textOverflow: "ellipsis", // ✅ 말줄임표 적용
                    padding, // ✅ 반응형 패딩
                    borderBottom: "1px solid #ddd",
                  },
                }}
              >
                {renderRow(item)}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
