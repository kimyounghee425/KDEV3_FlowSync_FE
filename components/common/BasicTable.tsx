"use client";

import { Stack, Table } from "@chakra-ui/react";
import { Children, ReactNode, useState } from "react";
import Pagination from "./Pagination";

interface BasicTableProps {
  headerTitle: ReactNode;
  children: ReactNode;
}

const BasicTable: React.FC<BasicTableProps> = ({ headerTitle, children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedChildren = Children.toArray(children).slice(
    startIndex,
    endIndex
  );

  return (
    <Stack width="full" gap="5">
      <Table.Root size="sm" interactive>
        <Table.Header>{headerTitle}</Table.Header>
        <Table.Body>{paginatedChildren}</Table.Body>
      </Table.Root>

      <Pagination
        currentPage={currentPage}
        totalCount={Children.count(children)}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </Stack>
  );
};

export default BasicTable;
