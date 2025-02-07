"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  createListCollection,
  Flex,
  Spinner,
  Table,
} from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";
import StatusTag from "@/src/components/common/StatusTag";
import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import SearchSection from "@/src/components/common/SearchSection";
import FilterSelectBox from "@/src/components/common/FilterSelectBox";
import Pagination from "@/src/components/common/Pagination";
import ProgressStepSection from "@/src/components/common/ProgressStepSection";
import { formatDynamicDate } from "@/src/utils/formatDateUtil";
import { useProjectQuestionList } from "@/src/hook/useFetchBoardList";
import { useProjectProgressStepData } from "@/src/hook/useFetchData";

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
  const { projectId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const resolvedProjectId = Array.isArray(projectId)
    ? projectId[0]
    : projectId || "";
  const keyword = searchParams?.get("keyword") || "";
  const progressStep = searchParams?.get("progressStep") || "";
  const status = searchParams?.get("status") || "";
  const currentPage = parseInt(searchParams?.get("currentPage") || "1", 10);
  const pageSize = parseInt(searchParams?.get("pageSize") || "5", 10);

  // ProgressStep 데이터 패칭
  const {
    data: progressStepData,
    loading: progressStepLoading,
    error: progressStepError,
  } = useProjectProgressStepData(resolvedProjectId);
  // 프로젝트 질문 게시판 목록 데이터 패칭
  const {
    data: projectQuestionList,
    paginationInfo,
    loading: projectQuestionListLoading,
    error: projectQuestionError,
  } = useProjectQuestionList(
    resolvedProjectId,
    keyword,
    progressStep,
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

  const handleRowClick = (taskId: string) => {
    router.push(`/projects/${projectId}/questions/${taskId}`);
  };

  // 신규등록 버튼 클릭 시 - 질문글 등록 페이지로 이동
  const handleProjectQuestionCreateButton = () => {
    router.push(`/projects/${projectId}/questions/new`);
  };

  return (
    <ProjectLayout>
      {/* 프로젝트 단계 섹션 */}
      {progressStepError ? (
        <Alert.Root status="error">
          <Alert.Indicator>
            <Spinner size="sm" />
          </Alert.Indicator>
          <Alert.Title>
            프로젝트 단계 정보를 불러오지 못했습니다. 다시 시도해주세요.
          </Alert.Title>
        </Alert.Root>
      ) : (
        <ProgressStepSection
          progressStep={progressStepData || []}
          loading={progressStepLoading}
        />
      )}
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
        <Flex justifyContent={"space-between"}>
          <Button
            variant={"surface"}
            _hover={{ backgroundColor: "#00a8ff", color: "white" }}
            onClick={handleProjectQuestionCreateButton}
          >
            신규 등록
          </Button>
          {/* 검색 섹션 */}
          <SearchSection keyword={keyword} placeholder="제목 입력">
            <FilterSelectBox
              statusFramework={questionStatusFramework}
              selectedValue={status}
              queryKey="status"
            />
          </SearchSection>
        </Flex>
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
          loading={projectQuestionListLoading}
          renderRow={(question) => (
            <>
              <Table.Cell>
                <StatusTag>
                  {STATUS_LABELS[question.category] || "알 수 없음"}
                </StatusTag>
              </Table.Cell>
              <Table.Cell>{"주농퐉"}</Table.Cell>
              <Table.Cell>{question.title}</Table.Cell>
              <Table.Cell>
                <StatusTag>
                  {STATUS_LABELS[question.status] || "알 수 없음"}
                </StatusTag>
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
