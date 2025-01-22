"use client";

import { ReactNode } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { Layers, List, MessageCircleQuestion } from "lucide-react";
import { SegmentedControl } from "@/src/components/ui/segmented-control";
import ProjectInfo from "@/src/components/pages/projectTasksPage/components/ProjectInfo";
import ProgressStepSection from "@/src/components/pages/projectTasksPage/components/ProgressStepSection";
import BoardSearchSection from "@/src/components/pages/projectTasksPage/components/BoardSearchSection";

interface LayoutProps {
  children: ReactNode;
}

// 프로젝트 정보 예시 (실제로는 서버에서 받아오기)
const dummyProjectInfo = {
  projectTitle: "커넥티드에듀",
  description: "웹 랜딩페이지 개발 건",
  jobRole: "비엔시스템PM",
  profileImageUrl: "https://i.pravatar.cc/300?u=iu",
  name: "이태영",
  jobTitle: "본부장",
  phoneNum: "010-1234-1324",
  projectStartAt: "2024년 9월 1일",
  projectCloseAt: "2024년 12월 31일",
};

const projectMenu = [
  {
    value: "tasks",
    label: (
      <HStack>
        <List />
        업무관리
      </HStack>
    ),
  },
  {
    value: "questions",
    label: (
      <HStack>
        <MessageCircleQuestion />
        소통관리
      </HStack>
    ),
  },
  {
    value: "workflow",
    label: (
      <HStack>
        <Layers />
        진척관리
      </HStack>
    ),
  },
];

// 콜백 타입 선언 (선택적으로 별도 타입 정의 가능)
type ValueChangeCallback = (details: { value: string }) => void;

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 확인
  const { projectId } = useParams(); // useParams로 projectId 추출

  // 현재 어느 탭인지 추출 (ex: /projects/[projectId]/tasks -> "tasks")
  // pathname: "/projects/123/tasks" -> segments: ["projects", "123", "tasks"]
  const currentTab = pathname.split("/").pop(); // "tasks" | "questions" | "workflow" etc

  // 탭 변경 시 호출 -> 라우팅
  const handleTabChange: ValueChangeCallback = (details) => {
    // details.value = "tasks" | "questions" | "workflow" | ...
    router.push(`/projects/${projectId}/${details.value}`);
  };

  return (
    <>
      {/* 상단 영역 */}
      <Flex
        direction="column"
        padding="30px 23px"
        gap="8px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="md"
        mb="30px"
      >
        {/* 제목 + 탭 전환 */}
        <Flex justifyContent={"space-between"}>
          <Flex gap="10px">
            <Heading size={"4xl"}>{dummyProjectInfo.projectTitle}</Heading>
            <Text fontWeight="500" color="#BBB" fontSize="20px">
              {dummyProjectInfo.description}
            </Text>
          </Flex>
          {/* SegmentedControl -> 선택된 탭은 currentTab */}
          <SegmentedControl
            value={currentTab} // 현재 탭
            onValueChange={handleTabChange}
            items={projectMenu}
          />
        </Flex>
        {/* 프로젝트 상세 정보 */}
        <ProjectInfo projectInfo={dummyProjectInfo} />
      </Flex>

      {/* 예: 프로젝트 단계(진척) 섹션 (공통) */}
      {/* 만약 업무관리, 소통관리 페이지에도 보여주고 싶다면 여기에, 
            특정 탭에서만 보여주고 싶다면 children 쪽에서 제어하세요. */}
      <ProgressStepSection projectId={projectId as string} />

      {/* 검색 섹션 (각 페이지 공통 검색 기능) */}
      <BoardSearchSection />

      {/* children -> 실제 tasks/page.tsx, questions/page.tsx, workflow/page.tsx 내용 */}
      <Box>{children}</Box>
    </>
  );
}
