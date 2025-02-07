import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import { ProjectStatus } from "@/src/constants/projectStatus"; // ENUM import

interface ProjectsStatusCardProps {
  count: number; // 숫자(통계 수치)
  label: string; // 카드에 표시될 라벨
  icon: ReactNode; // 카드 내부 아이콘
  status: ProjectStatus; // 필터링할 상태 값
}

/**
 * StatusCard 컴포넌트
 * - 통계 정보(숫자, 라벨)와 아이콘을 시각적으로 보여주는 카드
 *
 * @param count 카드에 표시할 숫자
 * @param label 카드에 표시할 라벨 (ex: "프로젝트 수")
 * @param icon  카드 안에 렌더링될 아이콘 요소
 */
export default function ProjectsStatusCard({
  count,
  label,
  icon,
  status,
}: ProjectsStatusCardProps) {
  const router = useRouter();
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
    base: "1.5rem", // 모바일
    sm: "1.75rem", // 작은 태블릿
    md: "2rem", // 데스크탑
  });

  const labelFontSize = useBreakpointValue({
    base: "0.875rem", // 모바일
    sm: "1rem", // 태블릿
    md: "1.125rem", // 데스크탑
  });

  // 다크모드 색상 설정
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.700");
  const hoverBgColor = useColorModeValue("gray.100", "gray.600");

  // 클릭 시 필터 적용
  const handleFilterClick = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("currentPage", "1"); // 페이지를 1로 초기화
    if (status !== ProjectStatus.ALL) {
      params.set("status", status);
    } else {
      params.delete("status"); // "전체" 선택 시 status 제거
    }
    router.push(`?${params.toString()}`);
  };
  // http://localhost:3000/?status=CONTRACT&currentPage=1

  return (
    <Box
      background="white"
      width={cardWidth}
      height={cardHeight}
      border={`1px solid ${borderColor}`}
      borderRadius="lg"
      boxShadow="sm"
      padding={4}
      transition="all 0.3s ease"
      _hover={{
        backgroundColor: hoverBgColor,
        cursor: "pointer",
        transform: "scale(1.05)", // 살짝 확대 효과
      }}
      onClick={handleFilterClick} // 클릭 시 필터 적용
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
          <Text fontSize={labelFontSize} fontWeight={400} color={textColor}>
            {label}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
