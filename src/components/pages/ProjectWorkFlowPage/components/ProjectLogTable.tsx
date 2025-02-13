"use client";

import { useEffect, useState } from "react";
import { Table, Spinner, Text } from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";

interface ProjectLogTableProps {
  projectId: string;
  progressStepId: string;
}

export default function ProjectLogTable({
  projectId,
  progressStepId,
}: ProjectLogTableProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   async function fetchLogs() {
  //     try {
  //       const response = await fetchProjectLogDataApi(
  //         projectId,
  //         progressStepId,
  //       );
  //       setLogs(response.data || []);
  //       setError(null);
  //     } catch (err) {
  //       setError("로그 데이터를 불러오는 중 오류가 발생했습니다.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchLogs();
  // }, [projectId, progressStepId]);

  if (loading) return <Spinner size="md" />;
  if (error) return <Text color="red.500">{error}</Text>;
  if (logs.length === 0) return <Text>로그가 없습니다.</Text>;

  return (
    <CommonTable
      headerTitle={
        <Table.Row>
          <Table.ColumnHeader>순서</Table.ColumnHeader>
          <Table.ColumnHeader>진행단계명</Table.ColumnHeader>
          <Table.ColumnHeader>날짜지정(시작일-완료예정일)</Table.ColumnHeader>
          <Table.ColumnHeader>종료일시</Table.ColumnHeader>
          <Table.ColumnHeader>승인자</Table.ColumnHeader>
          <Table.ColumnHeader>로그</Table.ColumnHeader>
        </Table.Row>
      }
      data={[]}
      loading={false}
      renderRow={(index = 0) => {
        return (
          <Table.Row>
            <Table.Cell>{index + 1}</Table.Cell>

            <Table.Cell></Table.Cell>
          </Table.Row>
        );
      }}
    />
  );
}
