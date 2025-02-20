"use client";

import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import {
  Stack,
  Input,
  Textarea,
  Button,
  Box,
  Text,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { Palette, RefreshCcw } from "lucide-react";
import { SketchPicker, ColorResult } from "react-color";
import CustomModal from "@/src/components/pages/ProjectWorkFlowPage/components/CustomModal";
import { useUpdateProjectProgressStep } from "@/src/hook/useMutationData";
import { useProjectProgressStepDetail } from "@/src/hook/useFetchData";

interface EditProgressStepModalProps {
  projectId: string;
  progressStepId: string;
  isOpen: boolean; // 외부에서 모달 상태 제어
  onClose: () => void; // 외부에서 모달 닫기
  onStepUpdated: () => void; // 수정 후 리패치 함수
}

export default function EditProgressStepModal({
  projectId,
  progressStepId,
  isOpen,
  onClose,
  onStepUpdated,
}: EditProgressStepModalProps) {
  // 수정 폼 데이터 조회
  const { data: progressStep } = useProjectProgressStepDetail(
    projectId,
    progressStepId,
  );

  const [stepTitle, setStepTitle] = useState("");
  const [stepColor, setStepColor] = useState("#333333");
  const [stepDescription, setStepDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // 진행단계 수정
  const { mutate: updateProgressStep } = useUpdateProjectProgressStep();

  // 모달이 열릴 때 초기 데이터 설정
  useEffect(() => {
    if (isOpen && progressStep) {
      setStepTitle(progressStep.name);
      setStepColor(progressStep.color);
      setStepDescription(progressStep.description);
    }
  }, [isOpen, progressStep]);

  // 모달 닫힐 때 입력값 초기화
  const handleClose = () => {
    onClose();
    setStepTitle("");
    setStepColor("#333333");
    setStepDescription("");
    setIsColorPickerOpen(false);
  };

  const handleSubmit = useCallback(
    debounce(async () => {
      if (!stepTitle.trim()) {
        alert("단계명을 입력해주세요.");
        return;
      }

      setIsSaving(true);
      try {
        await updateProgressStep(projectId, progressStepId, {
          title: stepTitle,
          color: stepColor,
          description: stepDescription,
        });
        onStepUpdated(); // 데이터 갱신
        handleClose();
      } catch (error) {
        // "진행 단계 수정 실패:"
        return; // 실패하면 다음 코드 실행 안 하고 중단
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    [
      stepTitle,
      stepColor,
      stepDescription,
      projectId,
      progressStepId,
      updateProgressStep,
      onStepUpdated,
    ],
  );

  return (
    <CustomModal
      title="진행 단계 수정"
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
    >
      <Box p={4} borderRadius="md" minHeight="480px">
        <Stack gap={4}>
          {/* 단계명 입력 */}
          <Box>
            <Text fontSize="md" fontWeight="bold">
              단계명 <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              placeholder="예: 개발 완료"
              value={stepTitle}
              onChange={(e) => setStepTitle(e.target.value)}
              required
            />
          </Box>

          {/* 설명 입력 */}
          <Box>
            <Text fontSize="md" fontWeight="bold">
              설명 <span style={{ color: "red" }}>*</span>
            </Text>
            <Textarea
              placeholder="이 단계에 대한 설명을 입력하세요."
              value={stepDescription}
              onChange={(e) => setStepDescription(e.target.value)}
              autoresize
            />
          </Box>

          {/* 색상 선택 */}
          <Box>
            <Text fontSize="md" fontWeight="bold">
              색상 선택
            </Text>
            <Text fontSize="sm" color="gray.500">
              색상을 지정하지 않으면 기본 색상 <strong>#333333</strong>이
              사용됩니다.
            </Text>

            <Flex alignItems="center" gap={3} mt={2}>
              <IconButton
                aria-label="색상 선택"
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                backgroundColor={"gray.200"}
                _hover={{ backgroundColor: "gray.300" }}
              >
                <Palette />
              </IconButton>
              {/* 색상 초기화 버튼 (SketchPicker가 열릴 때만 표시) */}
              {isColorPickerOpen && (
                <IconButton
                  aria-label="색상 초기화"
                  onClick={() => setStepColor("#333333")}
                  backgroundColor="gray.100"
                  _hover={{ backgroundColor: "gray.200" }}
                >
                  <RefreshCcw />
                </IconButton>
              )}
              <Text fontSize="1rem" fontWeight="bold" color={stepColor}>
                {stepTitle || "미리보기"}
              </Text>
            </Flex>

            {/* SketchPicker */}
            {isColorPickerOpen && (
              <SketchPicker
                color={stepColor}
                onChange={(color: ColorResult) => setStepColor(color.hex)}
              />
            )}
          </Box>

          <Button
            backgroundColor="blue.300"
            onClick={handleSubmit}
            _hover={{ bg: "blue.500" }}
            disabled={isSaving}
            loading={isSaving}
            loadingText="수정 중..."
            size="lg"
            mt={4}
          >
            진행단계 수정
          </Button>
        </Stack>
      </Box>
    </CustomModal>
  );
}
