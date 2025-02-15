import { ReactNode } from "react";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import { ProjectManagementSteps } from "@/src/constants/projectManagementSteps"; // ENUM import

interface ProjectsManagementStepCardProps {
  count: number; // 숫자(통계 수치)
  label: string; // 카드에 표시될 라벨
  icon: ReactNode; // 카드 내부 아이콘
  isSelected?: boolean;
  onClick: () => void;
}

/**
 * ManagementStepCard 컴포넌트
 * - 통계 정보(숫자, 라벨)와 아이콘을 시각적으로 보여주는 카드
 *
 * @param count 카드에 표시할 숫자
 * @param label 카드에 표시할 라벨 (ex: "프로젝트 수")
 * @param icon  카드 안에 렌더링될 아이콘 요소
 */
export default function ProjectsManagementStepCard({
  count,
  label,
  icon,
  isSelected = false,
  onClick,
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

  const countFontSize = useBreakpointValue({
    base: "1.4rem", // 모바일
    sm: "1.7rem", // 작은 태블릿
    md: "2rem", // 데스크탑
  });

  const labelFontSize = useBreakpointValue({
    base: "0.75rem", // 모바일
    sm: "0.9rem", // 태블릿
    md: "1rem", // 데스크탑
  });

  // 다크모드 색상 설정
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.700");
  const hoverBgColor = useColorModeValue("gray.100", "gray.600");

  return (
    <Box
      background={isSelected ? "blue.100" : "white"}
      width={cardWidth}
      height={cardHeight}
      border={`1px solid ${borderColor}`}
      borderRadius="lg"
      boxShadow="sm"
      padding={3}
      transition="all 0.3s ease"
      _hover={
        isSelected
          ? {}
          : {
              backgroundColor: hoverBgColor,
              cursor: "pointer",
              transform: "scale(1.05)", // 살짝 확대 효과
            }
      }
      onClick={onClick} // 클릭 시 필터 적용
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
          <Text fontSize={countFontSize} fontWeight={700} color={textColor}>
            {count}
          </Text>
          {/* ✅ 줄 바꿈 방지 및 글자 생략 적용 */}
          <Text
            fontSize={labelFontSize}
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
