import { ReactNode } from "react";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import { ProjectManagementSteps } from "@/src/constants/projectManagementSteps"; // ENUM import

interface ProjectsManagementStepCardProps {
  label: string; // 카드에 표시될 라벨
  icon: ReactNode; // 카드 내부 아이콘
  managementStep: ProjectManagementSteps; // 필터링할 상태 값
  onClick: () => void;
  isSelected: boolean; // 선택 여부
  isDisabled?: boolean; // 비활성화 여부
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
  isDisabled = false,
}: ProjectsManagementStepCardProps) {
  // 반응형 크기 설정
  const cardWidth = useBreakpointValue({
    base: "100px", // 모바일
    sm: "130px", // 작은 태블릿
    md: "180px", // 데스크탑
  });

  const cardHeight = useBreakpointValue({
    base: "100px",
    sm: "120px",
    md: "140px",
  });

  const iconSize = useBreakpointValue({
    base: "2rem", // 모바일
    sm: "2.5rem", // 작은 태블릿
    md: "3rem", // 데스크탑
  });

  // 다크모드 색상 설정
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.700");
  const hoverBgColor = useColorModeValue("gray.100", "gray.600");
  const selectedBgColor = useColorModeValue("blue.100", "blue.900");

  return (
    <Box
      background={isSelected ? selectedBgColor : "white"}
      width={cardWidth}
      height={cardHeight}
      border={`1px solid ${borderColor}`}
      borderRadius="lg"
      boxShadow="sm"
      padding={3}
      transition="all 0.3s ease"
      _hover={
        !isDisabled
          ? { backgroundColor: hoverBgColor, transform: "scale(1.05)" }
          : undefined
      }
      cursor={isDisabled ? "not-allowed" : "pointer"}
      onClick={isDisabled ? undefined : onClick} // 클릭 방지
    >
      <Flex alignItems="center" height="100%" gap={3}>
        <Flex
          border={`1px solid ${borderColor}`}
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
            color={textColor}
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
