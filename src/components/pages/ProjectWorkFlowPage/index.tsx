"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import { Heading, Table, Button, Flex } from "@chakra-ui/react";
import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import ProjectsManagementStepCards from "@/src/components/pages/ProjectWorkFlowPage/components/ProjectManagementStepCards";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import CommonTable from "@/src/components/common/CommonTable";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import { useProjectProgressStepData } from "@/src/hook/useFetchData";
import DateSection from "@/src/components/pages/ProjectWorkFlowPage/components/DateSection";
import { useUpdateProjectProgressStep } from "@/src/hook/useMutationData";
import CustomModal from "@/src/components/pages/ProjectWorkFlowPage/components/CustomModal";
import ProjectLogTable from "@/src/components/pages/ProjectWorkFlowPage/components/ProjectLogTable";

// 날짜를 'YYYY-MM-DD HH:mm' 형식으로 변환하는 유틸 함수
const formatDate = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 1월이 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export default function ProjectWorkFlowPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const resolvedProjectId = Array.isArray(projectId)
    ? projectId[0]
    : (projectId ?? "");

  const {
    data: progressStepList,
    loading: progressStepLoading,
    error: progressStepError,
  } = useProjectProgressStepData(projectId as string);

  const { mutate: updateProgressStep } = useUpdateProjectProgressStep();

  const textColor = useColorModeValue("gray.700", "gray.200");

  // 날짜 상태 관리
  const [dates, setDates] = useState<
    Record<string, { startAt: Date | null; deadlineAt: Date | null }>
  >({});

  // 날짜 변경 핸들러
  const handleDateChange = (
    progressStepId: string,
    field: "startAt" | "deadlineAt",
    value: Date | null,
  ) => {
    setDates((prev) => ({
      ...prev,
      [progressStepId]: {
        ...prev[progressStepId],
        [field]: value,
      },
    }));
  };

  // 날짜 변경 후 PUT 요청
  const handleSaveDates = async (progressStepId: string) => {
    const stepDates = dates[progressStepId];
    if (!stepDates?.startAt && !stepDates?.deadlineAt) return;

    try {
      await updateProgressStep(resolvedProjectId, progressStepId, {
        startAt: formatDate(stepDates.startAt),
        deadlineAt: formatDate(stepDates.deadlineAt),
      });

      alert("날짜가 성공적으로 저장되었습니다.");
    } catch (error) {
      alert("날짜 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <ProjectLayout>
        <ProjectsManagementStepCards title={"관리 단계 변경"} />
      </ProjectLayout>

      <Heading
        size="2xl"
        color={textColor}
        lineHeight="base"
        paddingLeft="0.3rem"
        paddingBottom="0.7rem"
      >
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
            <Table.ColumnHeader>날짜지정(시작일-완료예정일)</Table.ColumnHeader>
            <Table.ColumnHeader>종료일시</Table.ColumnHeader>
            <Table.ColumnHeader>승인자</Table.ColumnHeader>
            <Table.ColumnHeader>로그</Table.ColumnHeader>
          </Table.Row>
        }
        data={progressStepList ?? []}
        loading={progressStepLoading}
        renderRow={(progressStep, index = 0) => {
          const isRowClickable = !!progressStep.relatedApprovalId;

          return (
            <Table.Row
              key={progressStep.id}
              onClick={(event) => {
                if (isRowClickable) {
                  router.push(
                    `/projects/${resolvedProjectId}/approvals/${progressStep.relatedApprovalId}`,
                  );
                }
                event.stopPropagation();
              }}
              css={{
                cursor: isRowClickable ? "pointer" : "default",
                "&:hover": isRowClickable ? { backgroundColor: "#f5f5f5" } : {},
                "& > td": { textAlign: "center" },
              }}
            >
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{progressStep.name}</Table.Cell>
              <Table.Cell>
                <Flex>
                  <DateSection
                    startAt={
                      dates[progressStep.id]?.startAt ??
                      (progressStep.startAt
                        ? new Date(progressStep.startAt)
                        : null)
                    }
                    closeAt={
                      dates[progressStep.id]?.deadlineAt ??
                      (progressStep.deadlineAt
                        ? new Date(progressStep.deadlineAt)
                        : null)
                    }
                    setStartAt={(value) =>
                      handleDateChange(progressStep.id, "startAt", value)
                    }
                    setCloseAt={(value) =>
                      handleDateChange(progressStep.id, "deadlineAt", value)
                    }
                  />
                  <Button
                    colorPalette="gray.100"
                    variant="surface"
                    size="sm"
                    onClick={() => handleSaveDates(progressStep.id)}
                    disabled={
                      !dates[progressStep.id]?.startAt ||
                      !dates[progressStep.id]?.deadlineAt
                    }
                  >
                    저장
                  </Button>
                </Flex>
              </Table.Cell>
              <Table.Cell>{progressStep.closeAt || "-"}</Table.Cell>
              <Table.Cell>{progressStep.relatedApprovalId || "-"}</Table.Cell>
              <Table.Cell>
                <CustomModal title="결제 로그" triggerText="로그">
                  <ProjectLogTable
                    projectId={resolvedProjectId}
                    progressStepId={progressStep.id}
                  />
                </CustomModal>
              </Table.Cell>
            </Table.Row>
          );
        }}
      />
    </>
  );
}
