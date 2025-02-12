"use client";

import { ReactNode } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { Layers, List, MessageCircleQuestion } from "lucide-react";
import { SegmentedControl } from "@/src/components/ui/segmented-control";
import ProjectInfoSection from "@/src/components/common/ProjectInfoSection";
import { useProjectInfo } from "@/src/hook/useFetchData";
import ErrorAlert from "@/src/components/common/ErrorAlert";

interface ProjectLayoutProps {
  children: ReactNode;
}

// 프로젝트 탭 메뉴
const projectMenu = [
  {
    value: "approvals",
    label: (
      <HStack>
        <List />
        결재관리
      </HStack>
    ),
  },
  {
    value: "questions",
    label: (
      <HStack>
        <MessageCircleQuestion />
        질문관리
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

export function ProjectLayout({ children }: ProjectLayoutProps) {
  const router = useRouter();
  const { projectId } = useParams();
  const pathname = usePathname();

  const resolvedProjectId = Array.isArray(projectId)
    ? projectId[0]
    : projectId || "";
  // 프로젝트 정보 데이터 패칭
  const {
    data: projectInfo,
    loading: projectInfoLoading,
    error: projectInfoError,
  } = useProjectInfo(resolvedProjectId);
  // 현재 탭 추출
  const currentTab = pathname.split("/").pop(); // "approvals" | "questions" | "workflow"

  // 탭 변경 핸들러
  const handleTabChange = (details: { value: string }) => {
    // details.value = "approvals" | "questions" | "workflow"
    router.push(`/projects/${projectId}/${details.value}`);
  };

  return (
    <>
      {/* 슬라이더 탭 */}
      <SegmentedControl
        value={currentTab}
        onValueChange={handleTabChange}
        items={projectMenu}
      />
      {projectInfoError && (
        <ErrorAlert message="프로젝트 기본 정보를 불러오지 못했습니다. 다시 시도해주세요." />
      )}
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
        <Flex justifyContent={"space-between"}>
          {/* 프로젝트 제목 및 설명 */}
          <Flex gap="10px">
            <Heading size={"4xl"}>{projectInfo?.projectName}</Heading>
            <Text fontWeight="500" color="#BBB" fontSize="20px">
              {projectInfo?.description}
            </Text>
          </Flex>
          <Text fontWeight="500" fontSize="20px">
            {projectInfo?.managementStep}
          </Text>
        </Flex>
        {/* 프로젝트 정보 */}
        <ProjectInfoSection
          projectInfo={projectInfo}
          loading={projectInfoLoading}
        />
      </Flex>

      {children}
    </>
  );
}
