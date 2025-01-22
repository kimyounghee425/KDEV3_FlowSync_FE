"use client";

import { Table } from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";
import CustomColorBox from "@/src/components/common/StatusTag";

// 질문(소통관리) 더미 데이터
const dummyData = [
  {
    id: 1,
    title: "클라이언트 요청사항 정리",
    regAt: "2024-01-10",
    status: "진행중",
    category: "질문",
  },
  {
    id: 2,
    title: "QA 피드백 정리",
    regAt: "2024-01-12",
    status: "완료",
    category: "답변",
  },
];

export default function QuestionsPage() {
  const handleRowClick = (id: number) => {
    console.log("Row clicked:", id);
  };

  return (
    <CommonTable
      headerTitle={
        <Table.Row backgroundColor={"#eee"}>
          <Table.ColumnHeader>제목</Table.ColumnHeader>
          <Table.ColumnHeader>등록일</Table.ColumnHeader>
          <Table.ColumnHeader>상태</Table.ColumnHeader>
          <Table.ColumnHeader>유형</Table.ColumnHeader>
        </Table.Row>
      }
      data={dummyData}
      loading={false}
      renderRow={(item) => (
        <>
          <Table.Cell>{item.title}</Table.Cell>
          <Table.Cell>{item.regAt}</Table.Cell>
          <Table.Cell>
            <CustomColorBox>{item.status}</CustomColorBox>
          </Table.Cell>
          <Table.Cell>
            <CustomColorBox>{item.category}</CustomColorBox>
          </Table.Cell>
        </>
      )}
      handleRowClick={handleRowClick}
    />
  );
}
