"use client";

import { Table } from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";
import CustomColorBox from "@/src/components/common/StatusTag";
import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import BoardSearchSection from "@/src/components/common/SearchSection";

// 진척관리 더미 데이터
const dummyData = [
  {
    id: 201,
    title: "디자인 완료",
    regAt: "2024-01-03",
    status: "100%",
    category: "디자인",
  },
  {
    id: 202,
    title: "개발 진행 중",
    regAt: "2024-01-06",
    status: "50%",
    category: "개발",
  },
];

export default function WorkflowPage() {
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
            <Table.ColumnHeader>단계</Table.ColumnHeader>
            <Table.ColumnHeader>등록일</Table.ColumnHeader>
            <Table.ColumnHeader>진척도</Table.ColumnHeader>
            <Table.ColumnHeader>분류</Table.ColumnHeader>
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
