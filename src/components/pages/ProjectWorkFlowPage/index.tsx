"use client";

import { Heading, Table } from "@chakra-ui/react";
import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import ProjectsManagementStepCards from "@/src/components/pages/ProjectWorkFlowPage/components/ProjectManagementStepCards";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import CommonTable from "@/src/components/common/CommonTable";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import { useProjectProgressStepData } from "@/src/hook/useFetchData";
import { useParams } from "next/navigation";

export default function ProjectWorkFlowPage() {
  const { projectId } = useParams();

  const {
    data: progressStepList,
    loading: progressStepLoading,
    error: progressStepError,
  } = useProjectProgressStepData(projectId as string);

  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <>
      <ProjectLayout>
        <ProjectsManagementStepCards title={"관리 단계 변경"} />
      </ProjectLayout>
      <Heading size="2xl" color={textColor} lineHeight="base">
        진행단계 요약
      </Heading>
      {progressStepError && (
        <ErrorAlert message="프로젝트 목록을 불러오지 못했습니다. 다시 시도해주세요." />
      )}

      {/*
       * 공통 테이블(CommonTable)
       *  - headerTitle: 테이블 헤더 구성
       *  - data: 테이블에 표시될 데이터
       *  - loading: 로딩 상태
       *  - renderRow: 한 줄씩 어떻게 렌더링할지 정의 (jsx 반환)
       *  - handleRowClick: 행 클릭 이벤트 핸들러
       */}
      <CommonTable
        headerTitle={
          <Table.Row
            backgroundColor={useColorModeValue("#eee", "gray.700")}
            css={{
              "& > th": { textAlign: "center" },
            }}
          >
            <Table.ColumnHeader>순서</Table.ColumnHeader>
            <Table.ColumnHeader>진행단계명</Table.ColumnHeader>
            <Table.ColumnHeader>시작일시/예정완료일자</Table.ColumnHeader>
            <Table.ColumnHeader>종료일시</Table.ColumnHeader>
            <Table.ColumnHeader>승인자</Table.ColumnHeader>
            <Table.ColumnHeader>로그</Table.ColumnHeader>
          </Table.Row>
        }
        data={progressStepList ?? []}
        loading={progressStepLoading}
        renderRow={(progressStep, index = 0) => (
          <Table.Row
            key={progressStep.id}
            onClick={(event) => event.stopPropagation()}
            css={{
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f5f5f5" },
              "& > td": { textAlign: "center" },
            }}
          >
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>{progressStep.name}</Table.Cell>
            <Table.Cell>
              {progressStep.startAt} - {progressStep.deadlineAt}
            </Table.Cell>
            <Table.Cell>{progressStep.closeAt || "-"}</Table.Cell>
            <Table.Cell>{progressStep.relatedApprovalId || "-"}</Table.Cell>
            <Table.Cell>{"-"}</Table.Cell>
          </Table.Row>
        )}
      />
    </>
  );
}
