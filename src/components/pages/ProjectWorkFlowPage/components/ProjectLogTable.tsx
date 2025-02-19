"use client";

import Link from "next/link";
import { Table } from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";
import { useProjectCompletionRequestsData } from "@/src/hook/useFetchBoardList";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import StatusTag from "@/src/components/pages/ProjectsPage/components/ManagementStepTag";
import Pagination from "@/src/components/common/Pagination";
import { useRouter } from "next/navigation";

interface ProjectLogTableProps {
  projectId: string;
  progressStepId: string;
}

const STATUS_LABELS: Record<string, string> = {
  CREATE: "등록",
  MODIFY: "수정",
  DELETE: "삭제",
  CONFIRM: "승인",
  REJECT: "반려",
};

export default function ProjectLogTable({
  projectId,
  progressStepId,
}: ProjectLogTableProps) {
  const router = useRouter();

  const {
    data: logList,
    paginationInfo,
    loading: logListLoading,
    error: logListError,
  } = useProjectCompletionRequestsData(
    projectId,
    progressStepId,
    1, // 첫 번째 페이지
    5, // 페이지 크기 (원하는 값으로 조정 가능)
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("currentPage", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      {logListError && (
        <ErrorAlert message="프로젝트 목록을 불러오지 못했습니다. 다시 시도해주세요." />
      )}
      <CommonTable
        columnsWidth={
          <>
            <Table.Column htmlWidth="20%" />
            <Table.Column htmlWidth="20%" />
            <Table.Column htmlWidth="20%" />
            <Table.Column htmlWidth="20%" />
            <Table.Column htmlWidth="20%" />
          </>
        }
        headerTitle={
          <Table.Row
            backgroundColor="#eee"
            css={{ "& > th": { textAlign: "center", whiteSpace: "nowrap" } }}
          >
            <Table.ColumnHeader>이력ID</Table.ColumnHeader>
            <Table.ColumnHeader>등록일시</Table.ColumnHeader>
            <Table.ColumnHeader>결재글ID</Table.ColumnHeader>
            <Table.ColumnHeader>결재상태</Table.ColumnHeader>
            <Table.ColumnHeader>승인자</Table.ColumnHeader>
          </Table.Row>
        }
        data={logList}
        loading={logListLoading}
        renderRow={(log) => {
          return (
            <Table.Row
              key={log.id}
              css={{
                "& > td": {
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            >
              <Table.Cell>{log.id}</Table.Cell>
              <Table.Cell>{log.regAt}</Table.Cell>
              <Table.Cell>
                {log.approvalId ? (
                  <Link
                    href={`/projects/${projectId}/approvals/${log.approvalId}`}
                    style={{
                      color: "#007bff",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }} // ✅ 클릭 가능한 스타일 적용
                  >
                    {log.approvalId}
                  </Link>
                ) : (
                  "-"
                )}
              </Table.Cell>
              <Table.Cell>
                <StatusTag>{STATUS_LABELS[log.status]}</StatusTag>
              </Table.Cell>
              <Table.Cell>{log.actor.name}</Table.Cell>
            </Table.Row>
          );
        }}
      />
      {/*
       * 페이지네이션 컴포넌트
       * paginationInfo: 현재 페이지, 총 페이지, 페이지 크기 등의 정보
       * handlePageChange: 페이지 이동 시 실행될 콜백
       */}
      <Pagination
        paginationInfo={
          paginationInfo && {
            ...paginationInfo,
            currentPage: paginationInfo.currentPage,
          }
        }
        handlePageChange={handlePageChange}
      />
    </>
  );
}
