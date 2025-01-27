"use client";

import { useParams, useRouter } from "next/navigation";
import { Box, createListCollection, Table } from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";
import CustomColorBox from "@/src/components/common/StatusTag";
import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import SearchSection from "@/src/components/common/SearchSection";
import StatusSelectBox from "@/src/components/common/StatusSelectBox";
import { useProjectQuestionList } from "@/src/hook/useProjectQuestionList";
import Pagination from "@/src/components/common/Pagination";
import ProgressStepSection from "@/src/components/common/ProgressStepSection";
import { useProjectQuestionProgressStep } from "@/src/hook/useProjectQuestionProgressStep";
import { formatDynamicDate } from "@/src/utils/formatDateUtil";

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

const STATUS_LABELS: Record<string, string> = {
  WAIT: "답변대기",
  COMPLETED: "답변완료",
  QUESTION: "질문",
  ANSWER: "답변",
};

export default function ProjectQuestionsPage() {
  const {
    projectQuestionList,
    paginationInfo,
    keyword,
    status,
    loading,
    fetchProjectQuestionList,
  } = useProjectQuestionList();

  const { projectId } = useParams();
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("currentPage", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
    fetchProjectQuestionList(page, paginationInfo?.pageSize || 5);
  };

  const handleRowClick = (taskId: string) => {
    router.push(`/projects/${projectId}/tasks/${taskId}`);
  };

  return (
    <ProjectLayout>
      {/* 프로젝트 단계 섹션 */}
      <ProgressStepSection
        fetchProgressStep={useProjectQuestionProgressStep}
        projectId={projectId as string}
      />
      <Box
        direction="column"
        padding="30px 23px"
        gap="8px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="md"
        mb="30px"
      >
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
              <Table.ColumnHeader>카테고리</Table.ColumnHeader>
              <Table.ColumnHeader>작성자</Table.ColumnHeader>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>상태</Table.ColumnHeader>
              <Table.ColumnHeader>작성일</Table.ColumnHeader>
            </Table.Row>
          }
          data={projectQuestionList}
          loading={loading}
          renderRow={(question) => (
            <>
              <Table.Cell>
                <CustomColorBox>
                  {STATUS_LABELS[question.category] || "알 수 없음"}
                </CustomColorBox>
              </Table.Cell>
              <Table.Cell>{"주농퐉"}</Table.Cell>
              <Table.Cell>{question.title}</Table.Cell>
              <Table.Cell>
                <CustomColorBox>
                  {STATUS_LABELS[question.status] || "알 수 없음"}
                </CustomColorBox>
              </Table.Cell>
              <Table.Cell>{formatDynamicDate(question.regAt)}</Table.Cell>
            </>
          )}
          handleRowClick={handleRowClick}
        />
        <Pagination
          paginationInfo={
            paginationInfo && {
              ...paginationInfo,
              currentPage: paginationInfo.currentPage,
            }
          }
          handlePageChange={handlePageChange}
        />
      </Box>
    </ProjectLayout>
  );
}
