"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Box, createListCollection, Flex, Table } from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";
import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import SearchSection from "@/src/components/common/SearchSection";
import FilterSelectBox from "@/src/components/common/FilterSelectBox";
import Pagination from "@/src/components/common/Pagination";
import ProgressStepSection from "@/src/components/common/ProgressStepSection";
import CreateButton from "@/src/components/common/CreateButton";
import { useProjectQuestionList } from "@/src/hook/useFetchBoardList";
import { useProjectQuestionProgressStepData } from "@/src/hook/useFetchData";
import ErrorAlert from "@/src/components/common/ErrorAlert";

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

const CATEGORY_LABELS: Record<string, string> = {
  QUESTION: "질문",
  ANSWER: "답변",
};

const STATUS_LABELS: Record<string, string> = {
  WAIT: "답변대기",
  COMPLETED: "답변완료",
};

export default function ProjectQuestionsPage() {
  const { projectId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const resolvedProjectId = Array.isArray(projectId)
    ? projectId[0]
    : projectId || "";
  const keyword = searchParams?.get("keyword") || "";
  const progressStepId = searchParams?.get("progressStepId") || "";
  const status = searchParams?.get("status") || "";
  const currentPage = parseInt(searchParams?.get("currentPage") || "1", 10);
  const pageSize = parseInt(searchParams?.get("pageSize") || "5", 10);

  // QuestionProgressStep 데이터 패칭
  const {
    data: questionProgressStepData,
    loading: questionProgressStepLoading,
    error: questionProgressStepError,
  } = useProjectQuestionProgressStepData(resolvedProjectId);
  // 프로젝트 질문 게시판 목록 데이터 패칭
  const {
    data: projectQuestionList,
    paginationInfo,
    loading: projectQuestionListLoading,
    error: projectQuestionError,
  } = useProjectQuestionList(
    resolvedProjectId,
    keyword,
    progressStepId,
    status,
    currentPage,
    pageSize,
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("currentPage", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
  };

  const handleRowClick = (approvalId: string) => {
    router.push(`/projects/${projectId}/questions/${approvalId}`);
  };

  // 신규등록 버튼 클릭 시 - 질문글 등록 페이지로 이동
  const handleProjectQuestionCreateButton = () => {
    router.push(`/projects/${projectId}/questions/new`);
  };

  return (
    <ProjectLayout>
      {/* 프로젝트 단계 섹션 */}
      {questionProgressStepError && (
        <ErrorAlert message="프로젝트 단계 정보를 불러오지 못했습니다. 다시 시도해주세요." />
      )}
      <ProgressStepSection
        progressStep={questionProgressStepData || []}
        loading={questionProgressStepLoading}
      />

      <Box direction="column" paddingX="1rem" gap="8px" mb="30px">
        <Flex justifyContent={"space-between"} paddingX="0.3rem">
          <CreateButton handleButton={handleProjectQuestionCreateButton} />
          {/* 검색 섹션 */}
          <SearchSection keyword={keyword} placeholder="제목 입력">
            <FilterSelectBox
              placeholder="질문상태"
              statusFramework={questionStatusFramework}
              selectedValue={status}
              queryKey="status"
              width="130px"
            />
          </SearchSection>
        </Flex>
        {projectQuestionError && (
          <ErrorAlert message="프로젝트 질문 목록을 불러오지 못했습니다. 다시 시도해주세요." />
        )}
        {/* 
          CommonTable: 게시글 목록을 렌더링하는 공통 테이블 컴포넌트
          - headerTitle: 테이블 헤더
          - data: 목록 데이터
          - loading: 로딩 상태
          - renderRow: 각 행의 셀을 어떻게 렌더링할지 정의
          - handleRowClick: 행 클릭 시 동작
        */}
        <CommonTable
          columnsWidth={
            <>
              <Table.Column htmlWidth="20%" />
              <Table.Column htmlWidth="10%" />
              <Table.Column htmlWidth="30%" />
              <Table.Column htmlWidth="20%" />
              <Table.Column htmlWidth="10%" />
              <Table.Column htmlWidth="10%" />
            </>
          }
          headerTitle={
            <Table.Row
              backgroundColor={"#eee"}
              css={{
                "& > th": { textAlign: "center", whiteSpace: "nowrap" },
              }}
            >
              <Table.ColumnHeader>진행단계</Table.ColumnHeader>
              <Table.ColumnHeader>질문유형</Table.ColumnHeader>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>작성자</Table.ColumnHeader>
              <Table.ColumnHeader>질문상태</Table.ColumnHeader>
              <Table.ColumnHeader>작성일</Table.ColumnHeader>
            </Table.Row>
          }
          data={projectQuestionList ?? []}
          loading={projectQuestionListLoading}
          renderRow={(question) => (
            <Table.Row
              key={question.id}
              onClick={() => handleRowClick(question.id)}
              css={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" },
                "& > td": {
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            >
              <Table.Cell style={{ color: question.progressStep.color }}>
                {question.progressStep.name}
              </Table.Cell>
              <Table.Cell>
                {CATEGORY_LABELS[question.category] || "알 수 없음"}
              </Table.Cell>
              <Table.Cell>{question.title}</Table.Cell>
              <Table.Cell>{question.register.name}</Table.Cell>
              <Table.Cell>
                {STATUS_LABELS[question.status] || "알 수 없음"}
              </Table.Cell>
              <Table.Cell>
                {(question.createdDate ?? "-").split(" ")[0]}
              </Table.Cell>
            </Table.Row>
          )}
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
