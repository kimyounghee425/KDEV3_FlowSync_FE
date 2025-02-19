"use client";

import { JSX, useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";
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
import { useParams } from "next/navigation";
import { useProjectInfoContext } from "@/src/context/ProjectInfoContext";
import { useUpdateProjectManagementStep } from "@/src/hook/useMutationData";

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

  const { mutate: updateManagementStep, loading: isLoading } =
    useUpdateProjectManagementStep();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string>();
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
    setSelectedStep(managementStep);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmNavigation = async () => {
    if (!selectedStep) return;

    const response = await updateManagementStep(
      projectId as string,
      selectedStep,
    );

    // 리렌더링을 위해 데이터 다시 가져오기
    if (response) await refetch();
    setIsConfirmDialogOpen(false);
  };

  return (
    <Flex
      direction="column"
      margin="2rem 1rem 2rem 1.3rem"
      width="full"
      alignItems="flex-start" // 왼쪽 정렬
      gap="1rem" // Heading과 카드들 사이 간격
    >
      <Heading fontSize="1.3rem">{title}</Heading>
      <Flex
        wrap="wrap"
        justifyContent="flex-start"
        alignItems="center"
        gap="2rem"
        width="100%"
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
    </Flex>
  );
}
