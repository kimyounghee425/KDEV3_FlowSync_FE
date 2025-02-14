"use client";

import { JSX, useState } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import {
  OctagonPause,
  PackageCheck,
  Signature,
  Swords,
  Wrench,
} from "lucide-react";
import ProjectsManagementStepCard from "@/src/components/pages/ProjectWorkFlowPage/components/ProjectsManagementStepCard";
import { ProjectManagementSteps } from "@/src/constants/projectManagementSteps";
import ConfirmDialog from "@/src/components/common/ConfirmDialog";
import { projectManagementStepApi } from "@/src/api/projects";
import { useParams } from "next/navigation";
import { showToast } from "@/src/utils/showToast";
import { useProjectInfoContext } from "@/src/context/ProjectInfoContext";

const icons: Partial<Record<ProjectManagementSteps, JSX.Element>> = {
  [ProjectManagementSteps.CONTRACT]: <Signature size="60%" />,
  [ProjectManagementSteps.IN_PROGRESS]: <Swords size="60%" />,
  [ProjectManagementSteps.COMPLETED]: <PackageCheck size="60%" />,
  [ProjectManagementSteps.MAINTENANCE]: <Wrench size="60%" />,
  [ProjectManagementSteps.PAUSED]: <OctagonPause size="60%" />,
};

interface ProjectsManagementStepCardsProps {
  title: string;
}

export default function ProjectsManagementStepCards({
  title,
}: ProjectsManagementStepCardsProps) {
  const { projectId } = useParams();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  // const bgColor = useColorModeValue("white", "gray.800");
  // const borderColor = useColorModeValue("gray.200", "gray.700");
  // const textColor = useColorModeValue("gray.700", "gray.200");

  const { data, refetch } = useProjectInfoContext();
  const currentManagementStep = data?.managementStep; // 현재 프로젝트 단계

  const mappedData = [
    {
      id: 1,
      label: "계약",
      step: ProjectManagementSteps.CONTRACT,
    },
    {
      id: 2,
      label: "진행중",
      step: ProjectManagementSteps.IN_PROGRESS,
    },
    {
      id: 3,
      label: "납품완료",
      step: ProjectManagementSteps.COMPLETED,
    },
    {
      id: 4,
      label: "하자보수",
      step: ProjectManagementSteps.MAINTENANCE,
    },
    {
      id: 5,
      label: "일시중단",
      step: ProjectManagementSteps.PAUSED,
    },
  ];

  const handleStepClick = (managementStep: string) => {
    if (managementStep === currentManagementStep) {
      showToast({
        title: "현재와 같은 단계입니다.",
        description: "이미 해당 프로젝트 관리 단계에 있습니다.",
        type: "info",
      });
      return;
    }
    setSelectedStep(managementStep);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmNavigation = async () => {
    if (!selectedStep) return;

    setIsLoading(true);
    try {
      await projectManagementStepApi(projectId as string, selectedStep);

      // selectedStep을 한글 라벨로 변환
      const selectedStepLabel =
        mappedData.find((item) => item.step === selectedStep)?.label ||
        selectedStep;

      showToast({
        title: "관리단계 변경 성공",
        description: `프로젝트 관리 단계가 ${selectedStepLabel}로 변경되었습니다.`,
        type: "success",
      });

      // 리렌더링을 위해 데이터 다시 가져오기
      await refetch();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "데이터를 불러오는데 실패했습니다.";
      showToast({
        title: "관리단계 변경 실패",
        description: "변경 중 오류가 발생했습니다.",
        type: "error",
        error: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setIsConfirmDialogOpen(false);
    }
  };

  return (
    <Box
      mb="2rem"
      width="full"
      mx="auto"
      // bg={bgColor}
      transition="all 0.3s ease-in-out"
    >
      <Heading
        size="2xl"
        // color={textColor}
        mb="10px"
        textAlign="left"
        paddingX="0.3rem"
      >
        {title}
      </Heading>
      <Flex
        wrap="nowrap"
        justifyContent="flex-start"
        alignItems="center"
        paddingX="32px"
        paddingY={4}
        // border={`1px solid ${borderColor}`}
        borderRadius="lg"
        boxShadow="md"
        gap={4}
        // bg={bgColor}
      >
        {mappedData.map((item) => {
          const isCurrentStep = item.step === currentManagementStep;

          return (
            <ProjectsManagementStepCard
              key={item.id}
              label={item.label}
              icon={icons[item.step]}
              managementStep={item.step}
              onClick={
                isCurrentStep ? () => {} : () => handleStepClick(item.step)
              }
              isSelected={isCurrentStep}
              isDisabled={isCurrentStep} // 비활성화된 경우 클릭, hover 제거
              isThin={true}
            />
          );
        })}
      </Flex>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmNavigation}
        title="프로젝트 관리단계 변경"
        description=""
        confirmText="확인"
        cancelText="취소"
        isLoading={isLoading}
      />
    </Box>
  );
}
