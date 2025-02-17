"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Flex, Heading, useBreakpointValue } from "@chakra-ui/react";
import {
  Folder,
  OctagonPause,
  OctagonX,
  PackageCheck,
  Signature,
  Swords,
  Wrench,
} from "lucide-react";
import ProjectsManagementStepCard from "@/src/components/pages/ProjectsPage/components/ProjectsManagementStepCard";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import { ProjectManagementSteps } from "@/src/constants/projectManagementSteps";
import { useManagementStepsCount } from "@/src/hook/useFetchData";
import { ManagementStepCountMap } from "@/src/types";
import { Loading } from "@/src/components/common/Loading";
import ErrorAlert from "@/src/components/common/ErrorAlert";

// 아이콘 배열 정의
const icons = [
  <Folder key="1" size="60%" color="black" />,
  <Signature key="2" size="60%" color="black" />,
  <Swords key="3" size="60%" color="black" />,
  <PackageCheck key="4" size="60%" color="black" />,
  <Wrench key="5" size="60%" color="black" />,
  <OctagonPause key="6" size="60%" color="black" />,
  <OctagonX key="7" size="60%" color="black" />,
];

interface ProjectsManagementStepCardsProps {
  title: string;
}
// 프로젝트 현황을 하나 보여주는 카드
export default function ProjectsManagementStepCards({
  title,
}: ProjectsManagementStepCardsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 선택된 관리 단계 상태
  const [selectedStep, setSelectedStep] = useState<ProjectManagementSteps>(
    (searchParams.get("managementStep") as ProjectManagementSteps) ||
      ProjectManagementSteps.ALL,
  );

  useEffect(() => {
    // ✅ URL의 managementStep이 바뀌면 selectedStep을 업데이트
    const newStep =
      (searchParams.get("managementStep") as ProjectManagementSteps) ||
      ProjectManagementSteps.ALL;
    setSelectedStep(newStep);
  }, [searchParams]); // ✅ searchParams 변경 시 실행

  const {
    data: managementStepsCountData,
    loading: managementStepsCountLoading,
    error: managementStepsCountError,
  } = useManagementStepsCount();

  // 반응형 크기 조정
  const gap = useBreakpointValue({
    base: 4, // 모바일: 좁은 간격
    sm: 6, // 태블릿: 중간 간격
    md: 8, // 데스크탑: 넓은 간격
  });

  const handleStepClick = (step: ProjectManagementSteps) => {
    if (step === selectedStep) {
      return;
    }
    setSelectedStep(step);
    const params = new URLSearchParams(window.location.search);
    params.set("currentPage", "1");
    if (step !== ProjectManagementSteps.ALL) {
      params.set("managementStep", step);
    } else {
      params.delete("managementStep");
    }
    router.push(`?${params.toString()}`);
  };

  // 백엔드에서 받은 데이터
  const managementStepCountMap =
    managementStepsCountData?.managementStepCountMap ??
    ({} as ManagementStepCountMap);

  // 전체 프로젝트 수 계산 (모든 상태 값 합산)
  const totalProjectsCount = (
    Object.values(managementStepCountMap) as number[]
  ).reduce<number>((sum, count) => sum + (count || 0), 0);

  // 데이터 매핑
  const mappedData = [
    {
      id: 1,
      count: totalProjectsCount,
      label: "전체",
      icon: icons[0],
      managementStepValue: ProjectManagementSteps.ALL,
    },
    {
      id: 2,
      count: managementStepCountMap.CONTRACT || 0,
      label: "계약",
      icon: icons[1],
      managementStepValue: ProjectManagementSteps.CONTRACT,
    },
    {
      id: 3,
      count: managementStepCountMap.IN_PROGRESS || 0,
      label: "진행중",
      icon: icons[2],
      managementStepValue: ProjectManagementSteps.IN_PROGRESS,
    },
    {
      id: 4,
      count: managementStepCountMap.COMPLETED || 0,
      label: "납품완료",
      icon: icons[3],
      managementStepValue: ProjectManagementSteps.COMPLETED,
    },
    {
      id: 5,
      count: managementStepCountMap.MAINTENANCE || 0,
      label: "하자보수",
      icon: icons[4],
      managementStepValue: ProjectManagementSteps.MAINTENANCE,
    },
    {
      id: 6,
      count: managementStepCountMap.PAUSED || 0,
      label: "일시중단",
      icon: icons[5],
      managementStepValue: ProjectManagementSteps.PAUSED,
    },
  ];

  if (managementStepsCountLoading) return <Loading />;

  return (
    <Box
      mb="2rem"
      width="full" // 전체 너비 사용
      mx="auto" // 가운데 정렬
      // maxWidth="var(--content-max-width)" // 공통 테이블과 같은 너비
      transition="all 0.3s ease-in-out"
    >
      {/* 고정 높이 추가 */}
      <Heading size="2xl" mb="10px" textAlign="left">
        {title}
      </Heading>
      {managementStepsCountError && (
        <ErrorAlert message="프로젝트 목록을 불러오지 못했습니다. 다시 시도해주세요." />
      )}
      {/* 카드 컨테이너 */}
      <Flex
        wrap="nowrap"
        justifyContent="center"
        alignItems="center"
        gap={gap}
        p={4}
        border="1px solid #e4e4e7"
        borderRadius="lg"
        boxShadow="md"
        overflow="hidden" // 가로 스크롤 방지
        height="100%" // Flex 컨테이너 높이 고정
      >
        {mappedData.map((item) => (
          <ProjectsManagementStepCard
            key={item.id}
            count={item.count}
            label={item.label}
            icon={item.icon}
            isSelected={selectedStep === item.managementStepValue}
            onClick={() => handleStepClick(item.managementStepValue)}
          />
        ))}
      </Flex>
    </Box>
  );
}
