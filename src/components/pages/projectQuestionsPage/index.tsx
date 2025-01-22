"use client";

import { Table } from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";
import CustomColorBox from "@/src/components/common/StatusTag";
import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import BoardSearchSection from "@/src/components/common/SearchSection";

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
    <ProjectLayout>
      {/* 검색 섹션 */}
      <BoardSearchSection />
      {/* 
          CommonTable: 게시글 목록을 렌더링하는 공통 테이블 컴포넌트
          - headerTitle: 테이블 헤더
          - data: 목록 데이터
          - loading: 로딩 상태
          - renderRow: 각 행의 셀을 어떻게 렌더링할지 정의
          - handleRowClick: 행 클릭 시 동작
        */}
      <CommonTable
        headerTitle={
          <Table.Row
            backgroundColor={"#eee"}
            css={{
              "& > th": { textAlign: "center" },
            }}
          >
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
    </ProjectLayout>
  );
}
