import { ReactNode } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

interface ProjectsStatusCardProps {
  count: number; // 숫자(통계 수치)
  label: string; // 카드에 표시될 라벨
  icon: ReactNode; // 카드 내부 아이콘
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
}: ProjectsStatusCardProps) {
  return (
    <Box
      background="white"
      width="250px"
      height="170px"
      border="1px solid #E2E8F0"
      borderRadius="lg"
      boxShadow="sm"
      padding={4}
    >
      {/* 
        Flex 컨테이너를 사용하여, 카드 내부를 가로 방향으로 배치
        아이콘과 텍스트 영역을 나란히 보여줌
      */}
      <Flex alignItems="center" height="100%" gap={6}>
        {/* 
          아이콘을 담는 원형 컨테이너 
          border, 크기(w, h)를 지정해 원 모양을 만들고,
          중앙 정렬을 위해 alignItems, justifyContent 사용
        */}
        <Flex
          border="1px solid #E2E8F0"
          borderRadius="full"
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          w="85px"
          h="85px"
        >
          {icon}
        </Flex>

        {/* 
          숫자(count)와 라벨(label)을 세로 방향으로 배치
          가운데 정렬하기 위해 alignItems="center" 사용
        */}
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Text fontSize={46} fontWeight={700} color="gray.700">
            {count}
          </Text>
          <Text fontSize={24} fontWeight={400} color="gray.500">
            {label}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
