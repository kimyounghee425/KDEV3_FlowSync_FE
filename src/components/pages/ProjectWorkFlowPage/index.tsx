"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { debounce } from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import { Heading, Table, Flex, Button, IconButton } from "@chakra-ui/react";
import { FileClock } from "lucide-react";
import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import ProjectsManagementStepCards from "@/src/components/pages/ProjectWorkFlowPage/components/ProjectManagementStepCards";
import CommonTable from "@/src/components/common/CommonTable";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import { useProjectProgressStepData } from "@/src/hook/useFetchData";
import DateSection from "@/src/components/pages/ProjectWorkFlowPage/components/DateSection";
import CustomModal from "@/src/components/pages/ProjectWorkFlowPage/components/CustomModal";
import ProjectLogTable from "@/src/components/pages/ProjectWorkFlowPage/components/ProjectLogTable";
import { useUpdateProjectProgressStepSchedule } from "@/src/hook/useMutationData";
import { formatDate } from "@/src/utils/formatDateUtil";
import DraggableProgressSteps from "@/src/components/pages/ProjectWorkFlowPage/components/DraggableProgressStep";

export default function ProjectWorkFlowPage() {
  const { projectId } = useParams();
  const resolvedProjectId = Array.isArray(projectId)
    ? projectId[0]
    : (projectId ?? "");

  // ✅ 모달 상태 추가
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  // ✅ "보기" 버튼 클릭 시 실행될 함수
  const handleOpenLogModal = (stepId: string) => {
    setSelectedStepId(stepId);
    setIsLogModalOpen(true);
  };

  // ✅ 모달 닫기
  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
    setSelectedStepId(null);
  };

  // 진행단계별 정보 조회
  const {
    data: progressStepList,
    loading: progressStepLoading,
    error: progressStepError,
    refetch: refetchProgressStepList,
  } = useProjectProgressStepData(projectId as string);

  // 진행단계 시작일자-예정완료일자 수정 요청
  const { mutate: updateProgressStepShedule } =
    useUpdateProjectProgressStepSchedule();

  // 초기 날짜 데이터를 저장할 상태
  const [initialDates, setInitialDates] = useState<
    Record<string, { startAt: Date | null; deadlineAt: Date | null }>
  >({});

  // 변경 가능한 날짜 상태
  const [dates, setDates] = useState<typeof initialDates>({});

  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  // 초기 날짜 데이터를 받아오면, 상태를 설정
  useEffect(() => {
    if (progressStepList && !Object.keys(initialDates).length) {
      const initialData = Object.fromEntries(
        progressStepList.map((step) => [
          step.id,
          {
            startAt: step.startAt ? new Date(step.startAt) : null,
            deadlineAt: step.deadlineAt ? new Date(step.deadlineAt) : null,
          },
        ]),
      );

      setInitialDates(initialData);
      setDates(initialData);
    }
  }, [progressStepList]);

  // 날짜 변경 핸들러
  const handleDateChange = (
    progressStepId: string,
    field: "startAt" | "deadlineAt",
    value: Date | null,
  ) => {
    setDates((prev) => ({
      ...prev,
      [progressStepId]: { ...prev[progressStepId], [field]: value },
    }));
  };

  // 날짜 변경 후 PUT 요청
  const handleSaveDates = async (progressStepId: string) => {
    const stepDates = dates[progressStepId];
    if (!stepDates?.startAt && !stepDates?.deadlineAt) return;

    try {
      await updateProgressStepShedule(resolvedProjectId, progressStepId, {
        startAt: formatDate(stepDates.startAt),
        deadlineAt: formatDate(stepDates.deadlineAt),
      });

      // 성공했을 때만 `initialDates` 업데이트
      setInitialDates((prev) => ({
        ...prev,
        [progressStepId]: { ...stepDates },
      }));
    } catch (error) {
      console.error("날짜 업데이트 실패:", error);
    }
  };

  // ✅ `debounce` 적용한 handleSaveDates
  const debouncedSaveDates = useCallback(
    debounce(async (progressStepId: string) => {
      setIsSaving((prev) => ({ ...prev, [progressStepId]: true })); // ✅ 로딩 시작

      try {
        await handleSaveDates(progressStepId);
      } finally {
        setIsSaving((prev) => ({ ...prev, [progressStepId]: false })); // ✅ 로딩 종료
      }
    }, 1000),
    [handleSaveDates],
  );

  return (
    <>
      <ProjectLayout>
        <ProjectsManagementStepCards title={"관리단계 변경"} />

        {/* 진행단계 커스텀 (드래그앤드롭) 추가 */}
        <DraggableProgressSteps
          projectId={resolvedProjectId}
          progressStepList={progressStepList ?? []}
          progressStepError={progressStepError ?? ""}
          refetchProgressStepList={refetchProgressStepList}
        />

        <Flex direction="column" marginX="1rem">
          <Heading
            lineHeight="base"
            paddingBottom="0.7rem"
            fontSize="1.3rem"
            marginLeft="0.3rem"
          >
            진행단계 이력
          </Heading>

          {progressStepError && (
            <ErrorAlert message="프로젝트 목록을 불러오지 못했습니다. 다시 시도해주세요." />
          )}

          <CommonTable
            skeletonCount={9}
            colspan={8}
            columnsWidth={
              <>
                <Table.Column htmlWidth="5%" />
                <Table.Column htmlWidth="15%" />
                <Table.Column htmlWidth="20%" />
                <Table.Column htmlWidth="20%" />
                <Table.Column htmlWidth="10%" />
                <Table.Column htmlWidth="10%" />
                <Table.Column htmlWidth="10%" />
                <Table.Column htmlWidth="10%" />
              </>
            }
            headerTitle={
              <Table.Row
                backgroundColor="#eee"
                css={{
                  "& > th": { textAlign: "center", whiteSpace: "nowrap" },
                }}
              >
                <Table.ColumnHeader>순서</Table.ColumnHeader>
                <Table.ColumnHeader>진행단계명</Table.ColumnHeader>
                <Table.ColumnHeader>작업 시작일</Table.ColumnHeader>
                <Table.ColumnHeader>완료 예정일</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
                <Table.ColumnHeader>결재 담당자</Table.ColumnHeader>
                <Table.ColumnHeader>결재글ID</Table.ColumnHeader>
                <Table.ColumnHeader>이력</Table.ColumnHeader>
              </Table.Row>
            }
            data={progressStepList ?? []}
            loading={progressStepLoading}
            renderRow={(progressStep, index = 0) => {
              const stepId = progressStep.id;
              const stepDates = dates[stepId];

              // 날짜 변경 감지
              const isDateChanged =
                formatDate(stepDates?.startAt) !==
                  formatDate(initialDates[stepId]?.startAt) ||
                formatDate(stepDates?.deadlineAt) !==
                  formatDate(initialDates[stepId]?.deadlineAt);

              // 시작일이 완료예정일보다 늦으면 비활성화
              const isStartAfterDeadline =
                stepDates?.startAt &&
                stepDates?.deadlineAt &&
                stepDates.startAt > stepDates.deadlineAt;

              return (
                <Table.Row
                  key={stepId}
                  css={{
                    "& > td": {
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{progressStep.name}</Table.Cell>
                  <Table.Cell>
                    <Flex direction="row">
                      <DateSection
                        dateTime={stepDates?.startAt}
                        setDateTime={(value) =>
                          handleDateChange(stepId, "startAt", value)
                        }
                      />
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex direction="row">
                      <DateSection
                        dateTime={stepDates?.deadlineAt}
                        setDateTime={(value) =>
                          handleDateChange(stepId, "deadlineAt", value)
                        }
                        minDate={stepDates?.startAt}
                      />
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      variant={"surface"}
                      _hover={{ backgroundColor: "#00a8ff", color: "white" }}
                      size="sm"
                      disabled={
                        isSaving[stepId] ||
                        !isDateChanged ||
                        !!isStartAfterDeadline
                      }
                      onClick={() => debouncedSaveDates(stepId)}
                      loading={isSaving[stepId]}
                      loadingText="저장 중..."
                    >
                      저장
                    </Button>
                  </Table.Cell>
                  <Table.Cell>{progressStep.approver?.name || "-"}</Table.Cell>
                  <Table.Cell>
                    {progressStep.relatedApprovalId ? (
                      <Link
                        href={`/projects/${resolvedProjectId}/approvals/${progressStep.relatedApprovalId}`}
                        style={{
                          color: "#007bff",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }} // ✅ 클릭 가능한 스타일 적용
                      >
                        {progressStep.relatedApprovalId}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <IconButton
                      variant={"surface"}
                      _hover={{ backgroundColor: "#00a8ff", color: "white" }}
                      size="sm"
                      onClick={() => handleOpenLogModal(stepId)}
                    >
                      <FileClock />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              );
            }}
          />
        </Flex>
      </ProjectLayout>
      {/* ✅ 이력 모달 추가 */}
      {selectedStepId && (
        <CustomModal
          title={`[${
            progressStepList?.find((p) => p.id === selectedStepId)?.name
          }] 이력`}
          isOpen={isLogModalOpen}
          onClose={handleCloseLogModal}
          size="lg"
        >
          <ProjectLogTable
            projectId={resolvedProjectId}
            progressStepId={selectedStepId}
          />
        </CustomModal>
      )}
    </>
  );
}
