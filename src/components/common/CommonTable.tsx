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
  isClickable?: (item: T) => boolean;
}

export default function CommonTable<T extends { id: string }>({
  headerTitle,
  data = [],
  loading,
  renderRow,
  handleRowClick,
  isClickable = () => true,
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
        minWidth="600px" // 최소 크기 설정
        maxWidth="none" // 너비 제한 없음
        css={{
          borderCollapse: "collapse",
          "& th, & td": { border: "1.8px solid #ddd", padding: "8px" },
        }}
      >
        {/* 테이블 헤더 */}
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

        {/* 테이블 바디 */}
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={7} textAlign="center">
                <SkeletonText noOfLines={5} gap="4" />
              </Table.Cell>
            </Table.Row>
          ) : (
            data?.map((item) => {
              const isRowClickable = isClickable(item);
              return (
                <Table.Row
                  key={item.id}
                  onClick={(e) => {
                    if (!isRowClickable)
                      e.stopPropagation(); // 클릭 방지
                    else handleRowClick(item.id);
                  }}
                  css={{
                    "&:hover": isRowClickable
                      ? { backgroundColor: "#f1f1f1" }
                      : {},
                    "& > td": {
                      textAlign: "center",
                      height: "0.8rem",
                      fontSize: fontSize,
                      cursor: isRowClickable ? "pointer" : "not-allowed", // 금지 커서
                      opacity: isRowClickable ? 1 : 0.6, // 흐리게 처리
                      color: isRowClickable ? "inherit" : "gray.500", // 글씨 색상 회색
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      padding,
                      borderBottom: "1px solid #ddd",
                    },
                  }}
                >
                  {renderRow(item)}
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
