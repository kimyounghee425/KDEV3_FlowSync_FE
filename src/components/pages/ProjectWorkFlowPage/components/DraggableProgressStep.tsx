"use client";

import { useEffect, useState } from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useProjectApprovalProgressStepData } from "@/src/hook/useFetchData";
import { useUpdateProjectProgressStepOrder } from "@/src/hook/useMutationData";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import { Loading } from "@/src/components/common/Loading";
import { ProgressStepOrder } from "@/src/types";

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
  } = useProjectApprovalProgressStepData(projectId);

  // 백엔드 순서 업데이트 요청 훅
  const { mutate: updateProgressStepOrder } =
    useUpdateProjectProgressStepOrder();

  // 로컬 상태로 진행 단계 관리
  const [steps, setSteps] = useState(
    progressSteps?.filter((step) => Number(step.id) !== 0) || [],
  );

  useEffect(() => {
    if (progressSteps) {
      setSteps(progressSteps.filter((step) => Number(step.id) !== 0));
    }
  }, [progressSteps]);

  /**
   * 드래그 종료 시 실행되는 함수
   */
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return; // 드래그 취소 시 아무 동작 없음

    const updatedSteps = [...steps];
    const [movedStep] = updatedSteps.splice(result.source.index, 1);
    updatedSteps.splice(result.destination.index, 0, movedStep);

    // 상태 업데이트 (id가 0인 항목은 제외)
    const filteredSteps = updatedSteps.filter((step) => Number(step.id) !== 0);
    setSteps(filteredSteps);

    // 백엔드에 변경된 순서 반영
    const reorderedSteps: ProgressStepOrder[] = updatedSteps.map(
      (step, index) => ({
        id: step.id,
        order: index + 1,
      }),
    );

    updateProgressStepOrder(projectId, reorderedSteps);
  };

  return (
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
                      minWidth="120px" // ✅ 각 요소의 최소 너비 설정
                      maxWidth="150px" // ✅ 최대 너비 제한
                      flexShrink={0} // ✅ 가로 스크롤 시 크기 유지
                      whiteSpace="nowrap" // ✅ 텍스트 줄바꿈 방지
                      cursor="grab" // ✅ 드래그 가능 커서 적용
                    >
                      {index + 1}. {step.title}
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
  );
}
