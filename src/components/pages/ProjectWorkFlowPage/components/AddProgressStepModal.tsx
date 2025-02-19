"use client";

import { useCallback, useState } from "react";
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
import { debounce } from "lodash";
import { Palette, RefreshCcw } from "lucide-react";
import { SketchPicker, ColorResult } from "react-color";
import CustomModal from "@/src/components/pages/ProjectWorkFlowPage/components/CustomModal";
import { useCreateProjectProgressStep } from "@/src/hook/useMutationData";

interface AddProgressStepModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onStepAdded: () => void; // 새 단계 추가 후 실행할 함수
}

export default function AddProgressStepModal({
  projectId,
  isOpen,
  onClose,
  onStepAdded,
}: AddProgressStepModalProps) {
  const [stepTitle, setStepTitle] = useState("");
  const [stepColor, setStepColor] = useState("#333333");
  const [stepDescription, setStepDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // 진행단계 생성
  const { mutate: createProgressStep } = useCreateProjectProgressStep();

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
        alert("진행단계명을 입력해주세요!");
        return;
      }

      setIsAdding(true);
      try {
        const response = await createProgressStep(projectId, {
          title: stepTitle,
          color: stepColor,
          description: stepDescription,
        });

        if (response && response.result === "SUCCESS") {
          onStepAdded();
          handleClose();
        }
      } catch (error) {
        console.error("진행 단계 추가 실패:", error);
        return;
      } finally {
        setIsAdding(false);
      }
    }, 1000),
    [
      stepTitle,
      stepColor,
      stepDescription,
      projectId,
      createProgressStep,
      onStepAdded,
    ],
  );

  return (
    <CustomModal
      title="새 진행 단계 추가"
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
    >
      <Box p={4} borderRadius="md" minHeight="480px">
        <Stack gap={4}>
          {/* 단계명 입력 */}
          <Box>
            <Text fontSize="md" fontWeight="bold">
              진행단계명 <span style={{ color: "red" }}>*</span>
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
              설명 (선택)
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
              색상 (선택)
            </Text>
            <Text fontSize="sm" color="gray.500">
              색상을 지정하지 않으면 기본 색상 <strong>#333333</strong>이
              사용됩니다.
            </Text>

            <Flex alignItems="center" gap={3} mt={2}>
              {/* 색상 선택 버튼 */}
              <IconButton
                aria-label="색상 선택"
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                backgroundColor={"gray.200"}
                _hover={{ backgroundColor: "gray.400" }}
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

          {/* 추가 버튼 */}
          <Button
            backgroundColor="blue.300"
            onClick={handleSubmit}
            _hover={{ bg: "blue.500" }}
            loading={isAdding}
            loadingText="추가 중..."
            disabled={isAdding}
            size="lg"
            mt={4}
          >
            진행단계 추가
          </Button>
        </Stack>
      </Box>
    </CustomModal>
  );
}
