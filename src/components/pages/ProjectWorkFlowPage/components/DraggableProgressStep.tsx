"use client";

import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { useCallback } from "react";
import { Flex, Box, Button, Input, Heading } from "@chakra-ui/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Trash2, Plus } from "lucide-react";
import { useProjectProgressStepData } from "@/src/hook/useFetchData";
import {
  useCreateProjectProgressStep,
  useDeleteProjectProgressStep,
  useUpdateProjectProgressStepOrder,
} from "@/src/hook/useMutationData";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import { Loading } from "@/src/components/common/Loading";
import { ProgressStepOrder } from "@/src/types";
import ConfirmDialog from "@/src/components/common/ConfirmDialog";

interface DraggableProgressStepsProps {
  projectId: string;
}

/**
 * 진행 단계를 드래그앤드롭으로 재정렬하는 컴포넌트
 */
export default function DraggableProgressSteps({
  projectId,
}: DraggableProgressStepsProps) {
  // 진행 단계 데이터 가져오기
  const {
    data: progressSteps = [],
    loading: progressStepLoading,
    error: progressStepError,
    refetch,
  } = useProjectProgressStepData(projectId);

  // 백엔드 순서 업데이트 요청 훅
  const { mutate: updateProgressStepOrder } =
    useUpdateProjectProgressStepOrder();
  // 백엔드 단계 추가 요청 훅
  const { mutate: createProgressStep } = useCreateProjectProgressStep();
  // 백엔드 단계 삭제 요청 훅
  const { mutate: deleteProgressStep } = useDeleteProjectProgressStep();

  // 로컬 상태로 진행 단계 관리
  const [steps, setSteps] = useState<ProgressStepOrder[]>([]);
  const [newStepName, setNewStepName] = useState("");
  // 삭제 확인 모달 상태
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  useEffect(() => {
    if (!progressSteps) return;
    setSteps(
      progressSteps
        .filter((step) => Number(step.id) !== 0)
        .map((step, index) => ({
          id: step.id,
          order: index + 1, // ✅ order 속성 추가
          title: step.name,
        })),
    );
  }, [progressSteps]);

  /**
   * 드래그 종료 시 실행되는 함수
   */
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return; // 드래그 취소 시 아무 동작 없음

    const updatedSteps = [...steps];
    const [movedStep] = updatedSteps.splice(result.source.index, 1);
    updatedSteps.splice(result.destination.index, 0, movedStep);

    // 상태 업데이트 후 서버 반영
    setSteps(updatedSteps);

    // 백엔드에 변경된 순서 반영
    const reorderedSteps: ProgressStepOrder[] = updatedSteps.map(
      (step, index) => ({
        id: step.id,
        order: index + 1,
      }),
    );

    await updateProgressStepOrder(projectId, reorderedSteps);
    await refetch();
  };

  /**
   * 새로운 진행 단계 추가
   */
  const handleAddStep = useCallback(
    debounce(async () => {
      if (!newStepName.trim()) return;

      setIsAdding(true);
      const response = await createProgressStep(projectId, newStepName);
      setIsAdding(false);

      if (response && response.result === "SUCCESS") {
        await refetch();
        setNewStepName("");
      }
    }, 1000), // 1초 동안 연속 클릭 방지
    [newStepName, createProgressStep, projectId, refetch],
  );

  /**
   * 삭제 확인 모달 열기
   */
  const handleDeleteStep = (stepId: string) => {
    setSelectedStepId(stepId);
    setIsDeleteDialogOpen(true);
  };

  /**
   * 진행 단계 삭제 (확인 후 실행)
   */
  const onConfirmDelete = async () => {
    if (!selectedStepId) return;

    setIsDeleting(true);
    await deleteProgressStep(projectId, selectedStepId);
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);

    await refetch();
  };

  return (
    <>
      <Flex marginX="1.3rem" justifyContent="space-between">
        <Heading lineHeight="base" paddingBottom="0.7rem" fontSize="1.3rem">
          진행 단계 커스텀
        </Heading>
        {/* 진행 단계 추가 */}
        <Flex gap="0.5rem" justifyContent="flex-end">
          <Input
            placeholder="새 진행 단계 입력"
            value={newStepName}
            onChange={(e) => setNewStepName(e.target.value)}
            size="sm"
            width="200px"
          />
          <Button
            backgroundColor="blue.100"
            size="sm"
            onClick={handleAddStep}
            disabled={isAdding}
            loading={isAdding}
          >
            <Plus size={16} />
          </Button>
        </Flex>
      </Flex>

      <Box
        p="1rem"
        marginX="1.3rem"
        mb="2rem"
        border="1px solid #ddd"
        borderRadius="md"
        overflowX="auto"
        whiteSpace="nowrap"
      >
        {progressStepLoading && <Loading />}
        {progressStepError && (
          <ErrorAlert message="진행 단계를 불러오지 못했습니다." />
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="progressSteps" direction="horizontal">
            {(provided) => (
              <Flex
                ref={provided.innerRef}
                {...provided.droppableProps}
                direction="row"
                justifyContent="center"
                gap="0.5rem"
                overflowX="auto"
                p="0.5rem"
                borderRadius="md"
                minWidth="max-content"
              >
                {steps.map((step, index) => (
                  <Draggable
                    key={String(step.id)}
                    draggableId={String(step.id)}
                    index={index}
                  >
                    {(provided) => (
                      <Flex
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        border="1px solid"
                        borderColor="#e4e4e7"
                        p="0.8rem"
                        borderRadius="md"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                        minWidth="180px" // 각 요소의 최소 너비 설정
                        maxWidth="200px" // 최대 너비 제한
                        flexShrink={0} // 가로 스크롤 시 크기 유지
                        whiteSpace="nowrap" // 텍스트 줄바꿈 방지
                        cursor="grab" // 드래그 가능 커서 적용
                      >
                        {index + 1}. {step.title}
                        <Button
                          size="xs"
                          variant="ghost"
                          ml="0.5rem"
                          w="24px"
                          h="24px"
                          border="1px solid red.300"
                          bg="red.50"
                          _hover={{ bg: "red.100" }}
                          onClick={() => handleDeleteStep(step.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </Flex>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Flex>
            )}
          </Droppable>
        </DragDropContext>
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
        title="삭제 확인"
        description="정말로 이 단계를 삭제하시겠습니까?"
        confirmBackgroundColor="red.500"
        isLoading={isDeleting}
      />
    </>
  );
}
