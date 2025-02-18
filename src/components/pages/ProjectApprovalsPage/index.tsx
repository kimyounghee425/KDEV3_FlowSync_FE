"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Box, Flex, Table, createListCollection } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import CommonTable from "@/src/components/common/CommonTable";
import Pagination from "@/src/components/common/Pagination";
import StatusTag from "@/src/components/common/StatusTag";
import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import SearchSection from "@/src/components/common/SearchSection";
import StatusSelectBox from "@/src/components/common/FilterSelectBox";
import CreateButton from "@/src/components/common/CreateButton";
import ProgressStepSection from "@/src/components/common/ProgressStepSection";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import { getMeApi } from "@/src/api/getMembersApi";
import { useProjectApprovalProgressStepData } from "@/src/hook/useFetchData";
import { useProjectApprovalList } from "@/src/hook/useFetchBoardList";
import { formatDynamicDate } from "@/src/utils/formatDateUtil";

const approvalStatusFramework = createListCollection<{
  id: string;
  label: string;
  value: string;
}>({
  items: [
    { id: "1", label: "전체", value: "" },
    { id: "2", label: "대기", value: "WAIT" },
    { id: "3", label: "반려", value: "REJECTED" },
    { id: "4", label: "승인", value: "APPROVED" },
  ],
});

const STATUS_LABELS: Record<string, string> = {
  WAIT: "대기",
  APPROVED: "승인",
  REJECTED: "반려",
};

const CATEGORY_LABELS: Record<string, string> = {
  NORMAL_REQUEST: "일반결재",
  COMPLETE_REQUEST: "완료결재",
};

export default function ProjectApprovalsPage() {
  const { projectId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [myOrgType, setMyOrgType] = useState<string>("");
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
    data: approvalProgressStepData,
    loading: approvalProgressStepLoading,
    error: approvalProgressStepError,
  } = useProjectApprovalProgressStepData(resolvedProjectId);

  // ProjectApprovalList 데이터 패칭
  const {
    data: projectApprovalList,
    paginationInfo,
    loading: projectApprovalLoading,
    error: projectApprovalError,
  } = useProjectApprovalList(
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
    router.push(`/projects/${projectId}/approvals/${approvalId}`);
  };

  const handleProjectApprovalCreateButton = () => {
    if (myOrgType === "CUSTOMER") {
      alert("결재 글은 개발사만 작성이 가능합니다.");
      return;
    }
    router.push(`/projects/${projectId}/approvals/new`);
  };

  useEffect(() => {
    const getMyOrgType = async () => {
      try {
        const responseData = await getMeApi();
        setMyOrgType(responseData.data.organizationType);
      } catch (error) {
        console.error(error);
      }
    };
    getMyOrgType();
  }, []);

  return (
    <ProjectLayout>
      {approvalProgressStepError && (
        <ErrorAlert message="프로젝트 단계 정보를 불러오지 못했습니다. 다시 시도해주세요." />
      )}
      {/* 프로젝트 단계 섹션 */}
      <ProgressStepSection
        progressStep={approvalProgressStepData || []}
        loading={approvalProgressStepLoading}
      />
      <Box direction="column" paddingX="1rem" gap="8px" mb="30px">
        <Flex justifyContent={"space-between"} paddingX="0.3rem">
          <CreateButton handleButton={handleProjectApprovalCreateButton} />
          {/* 검색 섹션 */}
          <SearchSection keyword={keyword} placeholder="제목 입력">
            <StatusSelectBox
              placeholder="결재상태"
              statusFramework={approvalStatusFramework}
              selectedValue={status}
              queryKey="status"
              width="120px"
            />
          </SearchSection>
        </Flex>
        {projectApprovalError && (
          <ErrorAlert message="프로젝트 결제 목록을 불러오지 못했습니다. 다시 시도해주세요." />
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
              <Table.Column htmlWidth="15%" />
              <Table.Column htmlWidth="10%" />
              <Table.Column htmlWidth="25%" />
              <Table.Column htmlWidth="10%" />
              <Table.Column htmlWidth="10%" />
              <Table.Column htmlWidth="10%" />
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
              <Table.ColumnHeader>결재유형</Table.ColumnHeader>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>작성자</Table.ColumnHeader>
              <Table.ColumnHeader>결재상태</Table.ColumnHeader>
              <Table.ColumnHeader>결재자</Table.ColumnHeader>
              <Table.ColumnHeader>결재일</Table.ColumnHeader>
              <Table.ColumnHeader>등록일</Table.ColumnHeader>
            </Table.Row>
          }
          data={projectApprovalList}
          loading={projectApprovalLoading}
          renderRow={(approval) => (
            <Table.Row
              key={approval.id}
              onClick={() => handleRowClick(approval.id)}
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
              <Table.Cell>{approval.progressStep.name}</Table.Cell>
              <Table.Cell>
                <StatusTag>
                  {CATEGORY_LABELS[approval.category] || "알 수 없음"}
                </StatusTag>
              </Table.Cell>
              <Table.Cell>{approval.title}</Table.Cell>
              <Table.Cell>{approval.register.name}</Table.Cell>
              <Table.Cell>
                <StatusTag>
                  {STATUS_LABELS[approval.status] || "알 수 없음"}
                </StatusTag>
              </Table.Cell>
              <Table.Cell>{approval.approver?.name || "-"}</Table.Cell>
              <Table.Cell>
                {formatDynamicDate(approval.approvedAt) || "-"}
              </Table.Cell>
              <Table.Cell>{formatDynamicDate(approval.regAt)}</Table.Cell>
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
