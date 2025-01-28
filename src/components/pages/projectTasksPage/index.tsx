"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Box, Table, createListCollection } from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";
import Pagination from "@/src/components/common/Pagination";
import StatusTag from "@/src/components/common/StatusTag";
import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import SearchSection from "@/src/components/common/SearchSection";
import StatusSelectBox from "@/src/components/common/FilterSelectBox";
import { formatDynamicDate } from "@/src/utils/formatDateUtil";
import { ProjectProgressStepProps, ProjectTaskListResponse } from "@/src/types";
import { useFetchData } from "@/src/hook/useFetchData";
import {
  fetchProjectTaskList as fetchProjectTaskListApi,
  fetchProjectTaskProgressStep as fetchProjectTaskProgressStepApi,
} from "@/src/api/projects";
import { useFetchBoardList } from "@/src/hook/useFetchBoardList";
import ProgressStepSection from "@/src/components/common/ProgressStepSection";

const taskStatusFramework = createListCollection<{
  id: string;
  label: string;
  value: string;
}>({
  items: [
    { id: "1", label: "전체", value: "" },
    { id: "2", label: "대기", value: "WAIT" },
    { id: "3", label: "반려", value: "SUSPENSION" },
    { id: "4", label: "승인", value: "COMPLETED" },
  ],
});

const STATUS_LABELS: Record<string, string> = {
  WAIT: "답변대기",
  COMPLETED: "답변완료",
  QUESTION: "질문",
  ANSWER: "답변",
};

export default function ProjectTasksPage() {
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
  const { data: progressStepData, loading: progressStepLoading } = useFetchData<
    ProjectProgressStepProps[],
    [string]
  >({
    fetchApi: fetchProjectTaskProgressStepApi,
    params: [resolvedProjectId],
    dependencies: [resolvedProjectId],
  });

  // ProjectTaskList 데이터 패칭
  const {
    data: projectTaskList,
    paginationInfo,
    loading: projectTaskListLoading,
  } = useFetchBoardList<
    ProjectTaskListResponse,
    [string, string, string, string, number, number],
    "projectTasks"
  >({
    fetchApi: fetchProjectTaskListApi,
    keySelector: "projectTasks",
    params: [
      resolvedProjectId,
      keyword,
      progressStep,
      status,
      currentPage,
      pageSize,
    ],
    dependencies: [
      resolvedProjectId,
      keyword,
      progressStep,
      status,
      currentPage,
      pageSize,
    ],
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("currentPage", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
  };

  const handleRowClick = (taskId: string) => {
    router.push(`/projects/${projectId}/tasks/${taskId}`);
  };

  return (
    <ProjectLayout>
      {/* 프로젝트 단계 섹션 */}
      <ProgressStepSection
        progressStep={progressStepData || []}
        loading={progressStepLoading}
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
        <SearchSection keyword={keyword} placeholder="제목 입력">
          <StatusSelectBox
            statusFramework={taskStatusFramework}
            selectedValue={status}
            queryKey="status"
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
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>등록일</Table.ColumnHeader>
              <Table.ColumnHeader>상태</Table.ColumnHeader>
              <Table.ColumnHeader>유형</Table.ColumnHeader>
            </Table.Row>
          }
          data={projectTaskList}
          loading={projectTaskListLoading}
          renderRow={(task) => (
            <>
              <Table.Cell>
                <StatusTag>
                  {STATUS_LABELS[task.category] || "알 수 없음"}
                </StatusTag>
              </Table.Cell>
              <Table.Cell>{"주농퐉"}</Table.Cell>
              <Table.Cell>{task.title}</Table.Cell>
              <Table.Cell>
                <StatusTag>
                  {STATUS_LABELS[task.status] || "알 수 없음"}
                </StatusTag>
              </Table.Cell>
              <Table.Cell>{formatDynamicDate(task.regAt)}</Table.Cell>
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
