"use client";

import { ReactNode } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { Layers, List, MessageCircleQuestion } from "lucide-react";
import { SegmentedControl } from "@/src/components/ui/segmented-control";
import ProjectInfoSection from "@/src/components/common/ProjectInfoSection";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import { useProjectInfoContext } from "@/src/context/ProjectInfoContext";
import ProjectInfoSection222 from "../common/ProjectInfoSection222";

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

const MANAGEMENT_STEP_LABELS: Record<string, string> = {
  CONTRACT: "계약",
  IN_PROGRESS: "진행중",
  COMPLETED: "납품완료",
  MAINTENANCE: "하자보수",
  PAUSED: "일시중단",
  DELETED: "삭제",
};

export function ProjectLayout({ children }: ProjectLayoutProps) {
  const router = useRouter();
  const { projectId } = useParams();
  const pathname = usePathname();

  // 프로젝트 정보 데이터 패칭
  const {
    data: projectInfo,
    loading: projectInfoLoading,
    error: projectInfoError,
  } = useProjectInfoContext();
  // 현재 탭 추출
  const currentTab = pathname.split("/").pop(); // "approvals" | "questions" | "workflow"

  // 탭 변경 핸들러
  const handleTabChange = (details: { value: string }) => {
    // details.value = "approvals" | "questions" | "workflow"
    router.push(`/projects/${projectId}/${details.value}`);
  };

  return (
    <Flex direction="column" marginTop="1rem">
      {projectInfoError && (
        <ErrorAlert message="프로젝트 기본 정보를 불러오지 못했습니다. 다시 시도해주세요." />
      )}
      {/* 프로젝트 및 업체 정보 */}
      <Flex
        direction="column"
        gap="1rem"
        padding="1.2rem"
        border="1px solid #b8b1b1"
        borderRadius="1.5rem"
        marginBottom="2rem"
      >
        <Flex
          direction="row"
          gap="3rem"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flex="1.1">
            <Heading fontSize="1.5rem" paddingLeft="0.5rem">
              {projectInfo?.projectName}
            </Heading>
          </Box>
          {/* 프로젝트 정보 */}
          <ProjectInfoSection222
            projectInfo={projectInfo}
            loading={projectInfoLoading}
          />
        </Flex>
        <Text fontSize="1rem" fontStyle="italic" paddingLeft="0.5rem">
          {projectInfo?.description}
        </Text>
      </Flex>

      {/* 게시판 탭, 관리 단계 표시 */}
      <Flex
        direction="row"
        justifyContent={"space-between"}
        alignItems="center"
      >
        {/* 슬라이더 탭 */}
        <SegmentedControl
          value={currentTab}
          onValueChange={handleTabChange}
          items={projectMenu}
        />
        <Text
          fontWeight="bold"
          fontSize="1rem"
          paddingRight="1rem"
          color="#0c9ae0"
        >
          &bull; {MANAGEMENT_STEP_LABELS[projectInfo?.managementStep || ""]}{" "}
          단계
        </Text>
      </Flex>

      <Flex
        direction="column"
        gap="1rem"
        padding="1.2rem"
        border="1px solid #b8b1b1"
        borderRadius="0.8rem"
        height="fit-content"
        minHeight="500px"
      >
        {children}
      </Flex>
    </Flex>
  );
}
