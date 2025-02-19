"use client";

import { useEffect, useState } from "react";
import { Flex, Box, Button, Heading, IconButton } from "@chakra-ui/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useProjectProgressStepData } from "@/src/hook/useFetchData";

import {
  useDeleteProjectProgressStep,
  useUpdateProjectProgressStepOrder,
} from "@/src/hook/useMutationData";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import { ProgressStepOrder } from "@/src/types";
import ConfirmDialog from "@/src/components/common/ConfirmDialog";
import AddProgressStepModal from "@/src/components/pages/ProjectWorkFlowPage/components/AddProgressStepModal";
import EditProgressStepModal from "@/src/components/pages/ProjectWorkFlowPage/components/EditProgressStepModal";

interface DraggableProgressStepsProps {
  projectId: string;
  refetchProgressSteps: () => void;
}

/**
 * 진행 단계를 드래그앤드롭으로 재정렬하는 컴포넌트
 */
export default function DraggableProgressSteps({
  projectId,
  refetchProgressSteps,
}: DraggableProgressStepsProps) {
  // 진행 단계 데이터 가져오기
  const { data: progressSteps = [], error: progressStepError } =
    useProjectProgressStepData(projectId);

  // 백엔드 순서 업데이트 요청 훅
  const { mutate: updateProgressStepOrder } =
    useUpdateProjectProgressStepOrder();
  // 백엔드 단계 삭제 요청 훅
  const { mutate: deleteProgressStep } = useDeleteProjectProgressStep();

  // 로컬 상태로 진행 단계 관리
  const [steps, setSteps] = useState<ProgressStepOrder[]>([]);
  // 삭제 확인 모달
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  // 진행단계 추가 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // 진행단계 수정 모달 상태 (수정할 단계 ID 저장)
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  useEffect(() => {
    if (!progressSteps) return;
    setSteps(
      progressSteps
        .filter((step) => Number(step.id) !== 0)
        .map((step, index) => ({
          id: step.id,
          order: index + 1, // order 속성 추가
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
    await refetchProgressSteps();
  };

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

    await refetchProgressSteps();
  };

  return (
    <>
      <Flex marginX="1.3rem" justifyContent="flex-start" alignItems="center">
        <Heading lineHeight="base" fontSize="1.3rem">
          진행단계 관리
        </Heading>
        {/* 진행 단계 추가 */}
        <IconButton
          size="sm"
          backgroundColor="blue.100"
          _hover={{ bg: "blue.300" }}
          onClick={() => setIsAddModalOpen(true)}
          marginLeft="0.7rem"
        >
          <Plus />
        </IconButton>
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
                flexWrap="wrap"
                justifyContent="flex-start"
                gap="1rem"
                p="0.5rem"
                borderRadius="md"
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
                        flexShrink={1} // 가로 스크롤 시 크기 유지
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
                          border="1px solid blue.50"
                          bg="blue.50"
                          _hover={{ bg: "blue.100" }}
                          onClick={() => setEditingStepId(step.id)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          ml="0.5rem"
                          w="24px"
                          h="24px"
                          border="1px solid #fef2f2"
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

      {/* 추가 모달 */}
      <AddProgressStepModal
        projectId={projectId}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStepAdded={refetchProgressSteps}
      />

      {/* 수정 모달 */}
      {editingStepId && (
        <EditProgressStepModal
          projectId={projectId}
          progressStepId={editingStepId}
          isOpen={!!editingStepId}
          onClose={() => setEditingStepId(null)}
          onStepUpdated={refetchProgressSteps}
        />
      )}

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
