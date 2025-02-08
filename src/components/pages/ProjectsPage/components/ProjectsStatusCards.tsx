"use client";

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
import StatusCard from "@/src/components/pages/ProjectsPage/components/ProjectsStatusCard";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import { ProjectStatus } from "@/src/constants/projectStatus";

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

// 데이터 매핑
const mappedData = [
  {
    id: 1,
    count: 28,
    label: "전체",
    icon: icons[0],
    statusValue: ProjectStatus.ALL,
  },
  {
    id: 2,
    count: 6,
    label: "계약",
    icon: icons[1],
    statusValue: ProjectStatus.CONTRACT,
  },
  {
    id: 3,
    count: 8,
    label: "진행중",
    icon: icons[2],
    statusValue: ProjectStatus.IN_PROGRESS,
  },
  {
    id: 4,
    count: 8,
    label: "납품완료",
    icon: icons[3],
    statusValue: ProjectStatus.COMPLETED,
  },
  {
    id: 5,
    count: 6,
    label: "하자보수",
    icon: icons[4],
    statusValue: ProjectStatus.MAINTENANCE,
  },
  {
    id: 6,
    count: 3,
    label: "일시중단",
    icon: icons[5],
    statusValue: ProjectStatus.MAINTENANCE,
  },
  {
    id: 7,
    count: 0,
    label: "삭제",
    icon: icons[6],
    statusValue: ProjectStatus.MAINTENANCE,
  },
];

interface ProjectsStatusCardsProps {
  title: string;
}
// 프로젝트 현황을 하나 보여주는 카드
export default function ProjectsStatusCards({
  title,
}: ProjectsStatusCardsProps) {
  // 반응형 크기 조정
  const gap = useBreakpointValue({
    base: 4, // 모바일: 좁은 간격
    sm: 6, // 태블릿: 중간 간격
    md: 8, // 데스크탑: 넓은 간격
  });

  // 다크모드 색상
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Box
      mb="2rem"
      width="full" // 전체 너비 사용
      mx="auto" // 가운데 정렬
      // maxWidth="var(--content-max-width)" // 공통 테이블과 같은 너비
      border={`1px solid ${borderColor}`}
      borderRadius="lg"
      boxShadow="md"
      bg={bgColor} // 다크모드 배경색
      transition="all 0.3s ease-in-out"
    >
      {/* 고정 높이 추가 */}
      <Heading size="2xl" color={textColor} mb="10px" textAlign="left">
        {title}
      </Heading>
      {/* 카드 컨테이너 */}
      <Flex
        wrap="nowrap"
        justifyContent="space-between"
        alignItems="center"
        gap={gap}
        p={4}
        border={`1px solid ${borderColor}`}
        borderRadius="lg"
        boxShadow="md"
        bg={bgColor} // 다크모드 배경 색상
        overflow="hidden" // 가로 스크롤 방지
        height="100%" // Flex 컨테이너 높이 고정
      >
        {mappedData.map((item) => (
          <StatusCard
            key={item.id}
            count={item.count}
            label={item.label}
            icon={item.icon}
            status={item.statusValue} // 필터링할 상태 값 추가
          />
        ))}
      </Flex>
    </Box>
  );
}
