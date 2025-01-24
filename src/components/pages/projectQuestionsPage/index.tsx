"use client";

import { createListCollection, Table } from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";
import CustomColorBox from "@/src/components/common/StatusTag";
import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import SearchSection from "@/src/components/common/SearchSection";
import StatusSelectBox from "@/src/components/common/StatusSelectBox";
import { useProjectQuestionList } from "@/src/hook/useProjectQuestionList";
import Pagination from "@/src/components/common/Pagination";
import { useRouter } from "next/navigation";

const questionStatusFramework = createListCollection<{
  id: string;
  label: string;
  value: string;
}>({
  items: [
    { id: "1", label: "전체", value: "" },
    { id: "2", label: "답변대기", value: "WAIT" },
    { id: "3", label: "답변완료", value: "COMPLETED" },
  ],
});

export default function QuestionsPage() {
  const {
    projectQuestionList,
    paginationInfo,
    keyword,
    status,
    loading,
    fetchProjectQuestionList,
  } = useProjectQuestionList();

  const router = useRouter();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("page", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
    // 데이터를 다시 가져오기
    fetchProjectQuestionList(page, paginationInfo?.pageSize || 5);
  };

  const handleRowClick = (id: string) => {
    router.push(`/projects/${id}/tasks`);
  };

  return (
    <ProjectLayout>
      {/* 검색 섹션 */}
      <SearchSection
        keyword={keyword}
        fetchBoardList={fetchProjectQuestionList}
        placeholder="제목 입력"
      >
        <StatusSelectBox
          statusFramework={questionStatusFramework}
          status={status}
        />
      </SearchSection>
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
            <Table.ColumnHeader>작성일</Table.ColumnHeader>
            <Table.ColumnHeader>작성자</Table.ColumnHeader>
            <Table.ColumnHeader>제목</Table.ColumnHeader>
            <Table.ColumnHeader>상태</Table.ColumnHeader>
            <Table.ColumnHeader>유형</Table.ColumnHeader>
          </Table.Row>
        }
        data={projectQuestionList}
        loading={loading}
        renderRow={(question) => (
          <>
            <Table.Cell>{question.regAt}</Table.Cell>
            <Table.Cell>{"주농퐉"}</Table.Cell>
            <Table.Cell>{question.title}</Table.Cell>
            <Table.Cell>
              <CustomColorBox>{question.status}</CustomColorBox>
            </Table.Cell>
            <Table.Cell>
              <CustomColorBox>{question.category}</CustomColorBox>
            </Table.Cell>
          </>
        )}
        handleRowClick={handleRowClick}
      />
      <Pagination
        paginationInfo={
          paginationInfo && {
            ...paginationInfo,
            currentPage: paginationInfo.currentPage + 1,
          }
        }
        handlePageChange={handlePageChange}
      />
    </ProjectLayout>
  );
}
