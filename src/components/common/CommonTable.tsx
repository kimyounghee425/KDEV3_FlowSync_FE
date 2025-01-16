"use client";

import { ReactNode } from "react";
import { Table } from "@chakra-ui/react";
import { SkeletonText } from "@/src/components/ui/skeleton";

interface CommonTableProps<T> {
  headerTitle: ReactNode;
  data: T[];
  loading: boolean;
  renderRow: (item: T) => ReactNode;
  handleRowClick: (id: number) => void;
}

const CommonTable = <
  T extends {
    id: number;
  }
>({
  headerTitle,
  data,
  loading,
  renderRow,
  handleRowClick,
}: CommonTableProps<T>) => {
  return (
    <Table.Root size="sm" interactive>
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
                  fontSize: "md",
                  cursor: "pointer",
                },
              }}>
              {renderRow(item)}
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default CommonTable;
