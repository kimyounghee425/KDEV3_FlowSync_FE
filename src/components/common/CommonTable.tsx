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
}

export default function CommonTable<
  T extends {
    id: string;
  },
>({
  headerTitle,
  data = [],
  loading,
  renderRow,
  handleRowClick,
}: CommonTableProps<T>) {
  // 반응형 폰트 크기
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const padding = useBreakpointValue({ base: "2", md: "4" });

  return (
    <Box overflowX="auto" whiteSpace="nowrap">
      <Table.Root size="sm" width="100%">
        <Table.Header>{headerTitle}</Table.Header>

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
                  "& > td": {
                    textAlign: "center",
                    height: "55px",
                    fontSize: fontSize, // 반응형 폰트 크기
                    cursor: "pointer",
                    whiteSpace: "nowrap", // 텍스트 줄바꿈 방지
                    overflow: "hidden", // 넘치는 텍스트 숨김
                    textOverflow: "ellipsis", // 말줄임표 처리
                    padding, // 반응형 패딩
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
