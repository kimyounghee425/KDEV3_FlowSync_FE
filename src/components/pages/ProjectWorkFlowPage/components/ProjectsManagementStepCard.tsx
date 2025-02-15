import { ReactNode } from "react";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { ProjectManagementSteps } from "@/src/constants/projectManagementSteps"; // ENUM import

interface ProjectsManagementStepCardProps {
  label: string; // 카드에 표시될 라벨
  icon: ReactNode; // 카드 내부 아이콘
  managementStep: ProjectManagementSteps; // 필터링할 상태 값
  onClick: () => void;
  isSelected: boolean; // 선택 여부
  isDisabled?: boolean; // 비활성화 여부
  isThin?: boolean;
}

/**
 * ManagementStepCard 컴포넌트
 * - 프로젝트 관리 단계 카드 UI
 */
export default function ProjectsManagementStepCard({
  label,
  icon,
  onClick,
  isSelected,
  isThin = false,
  isDisabled = false,
}: ProjectsManagementStepCardProps) {
  // 반응형 크기 설정
  const cardWidth = useBreakpointValue({
    base: "100px", // 모바일;
    sm: "130px", // 작은 태블릿
    md: "180px", // 데스크탑
  });

  const cardHeight = useBreakpointValue({
    base: isThin ? "20px" : "100px",
    sm: isThin ? "40px" : "120px",
    md: isThin ? "60px" : "140px",
  });

  const iconSize = useBreakpointValue({
    base: "2rem", // 모바일
    sm: "2.5rem", // 작은 태블릿
    md: "3rem", // 데스크탑
  });

  return (
    <Box
      background={isSelected ? "blue.100" : "white"}
      width={cardWidth}
      height={cardHeight}
      border={`1px solid gray.200`}
      borderRadius="lg"
      boxShadow="sm"
      padding={3}
      transition="all 0.3s ease"
      _hover={
        !isDisabled
          ? { backgroundColor: "gray.100", transform: "scale(1.05)" }
          : undefined
      }
      cursor={isDisabled ? "default" : "pointer"}
      onClick={isDisabled ? undefined : onClick} // 클릭 방지
    >
      <Flex alignItems="center" height="100%" gap={3}>
        <Flex
          border={`1px solid gray.200`}
          borderRadius="full"
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          w={iconSize}
          h={iconSize}
        >
          {icon}
        </Flex>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {/* 줄 바꿈 방지 및 글자 생략 적용 */}
          <Text
            fontSize="md"
            fontWeight={500}
            color="gray.700"
            maxWidth="100px" // 글자 최대 너비 설정
            whiteSpace="nowrap" // 줄 바꿈 방지
            overflow="hidden"
            textOverflow="ellipsis" // 너무 길면 "..."
            textAlign="center"
          >
            {label}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
