"use client";

import { ReactNode, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Box, Flex, Heading, HStack, IconButton, Text } from "@chakra-ui/react";
import {
  ChevronDown,
  ChevronUp,
  Layers,
  List,
  MessageCircleQuestion,
  Settings,
} from "lucide-react";
import { SegmentedControl } from "@/src/components/ui/segmented-control";
import ProjectInfoSection from "@/src/components/common/ProjectInfoSection";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import { useProjectInfoContext } from "@/src/context/ProjectInfoContext";
import { useUserInfo } from "@/src/hook/useFetchData";

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
  // 현재 로그인한 사용자 정보 가져오기
  const { data: userInfo } = useUserInfo();
  console.log("사용자 정보:", userInfo); // 🔍 현재 로그인한 사용자 정보 출력

  const isAdmin = userInfo?.role === "ADMIN"; // 관리자 여부 확인
  console.log("isAdmin 값:", isAdmin); // 🔍 isAdmin 값 출력

  // 프로젝트 정보 접기/펼치기 상태
  const [isProjectInfoVisible, setIsProjectInfoVisible] = useState(false);

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
    <Flex direction="column" marginTop="1rem" width="100%">
      {projectInfoError && (
        <ErrorAlert message="프로젝트 기본 정보를 불러오지 못했습니다. 다시 시도해주세요." />
      )}
      {/* 프로젝트 및 업체 정보 */}
      <Flex
        direction="column"
        gap="1rem"
        padding="1.5rem 1.5rem 1rem 1.5rem"
        border="1px solid #b8b1b1"
        borderRadius="1.5rem"
        marginBottom="2rem"
      >
        {/* 프로젝트명 */}
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex direction="row" gap="0.5rem">
            <Heading
              fontSize="1.5rem"
              whiteSpace="nowrap" //  줄 바꿈 방지
              overflow="hidden"
              textOverflow="ellipsis" //  넘칠 경우 ... 처리
            >
              {projectInfo?.projectName}
            </Heading>
            {/* 프로젝트 정보 접기/펼치기 버튼 */}
            <IconButton
              aria-label="프로젝트 토글 버튼"
              as={isProjectInfoVisible ? ChevronUp : ChevronDown} // 아이콘 직접 전달
              onClick={() => setIsProjectInfoVisible(!isProjectInfoVisible)}
              variant="ghost"
              size="xs"
            />
          </Flex>
          {/* 관리자만 볼 수 있는 설정 버튼 */}
          {isAdmin && (
            <Box>
              <Settings
                onClick={() => router.push(`/projects/${projectId}/edit`)}
                cursor="pointer"
              />
            </Box>
          )}
        </Flex>
        {/* 프로젝트 설명 (접기/펼치기) */}
        {isProjectInfoVisible && (
          <>
            <Box flex="1">
              <Text
                fontSize="1rem"
                fontStyle="italic"
                paddingLeft="0.5rem"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                - {projectInfo?.description}
              </Text>
            </Box>
            <hr />
            {/* 고객사/개발사/프로젝트 일정 */}
            <Box flex="1">
              <ProjectInfoSection
                projectInfo={projectInfo}
                loading={projectInfoLoading}
              />
            </Box>
          </>
        )}
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
