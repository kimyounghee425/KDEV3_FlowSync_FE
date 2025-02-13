import { Box, Text, HStack, VStack, Flex } from "@chakra-ui/react";
import { Avatar } from "@/src/components/ui/avatar";
import { ProjectInfoProps } from "@/src/types";
import { formatDynamicDate } from "@/src/utils/formatDateUtil";
import { Loading } from "@/src/components/common/Loading";
import { Phone } from "lucide-react";

interface ProjectInfoSectionProps {
  projectInfo: ProjectInfoProps | null;
  loading: boolean;
}

// 프로젝트 기본정보 컴포넌트
export default function ProjectInfoSection({
  projectInfo,
  loading,
}: ProjectInfoSectionProps) {
  if (loading) {
    return <Loading />;
  }
  return (
    <Box
      p={3}
      // borderWidth="1px"
      border="none"
      borderRadius="lg"
      // boxShadow="sm"
      bg="white"
      // boxSizing="content-box"
    >
      <VStack align="stretch" gap={2}>
        {/* 개발사 정보 */}
        <Box
          p={2}
          borderRadius="md"
          bg="gray.50"
          boxSizing="content-box"
          padding="1rem"
        >
          <Text
            fontSize="1.1rem"
            paddingBottom="0.5rem"
            fontWeight="bold"
            mb={1}
          >
            🔧 개발사 정보
          </Text>
          <HStack justifyContent="space-between">
            <HStack gap={3}>
              <Avatar size="xs" src={projectInfo?.developerProfileImageUrl} />
              <Box>
                <Text fontSize="sm" fontWeight="bold">
                  {projectInfo?.developerOrgName}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {projectInfo?.developerOwnerName} (
                  {projectInfo?.developerJobTitle},{" "}
                  {projectInfo?.developerJobRole})
                </Text>
              </Box>
            </HStack>
            <Flex alignItems="center" minWidth="110px">
              <Phone size={14} color="gray" />
              <Text fontSize="sm" ml={1}>
                {projectInfo?.developerPhoneNum}
              </Text>
            </Flex>
          </HStack>
        </Box>

        {/* 고객사 정보 */}
        <Box
          p={2}
          borderRadius="md"
          bg="gray.50"
          boxSizing="content-box"
          padding="1rem"
        >
          <Text
            fontSize="1.1rem"
            paddingBottom="0.5rem"
            fontWeight="bold"
            mb={1}
          >
            {" "}
            🏢 고객사 정보
          </Text>
          <HStack justifyContent="space-between">
            <HStack gap={3}>
              <Avatar size="xs" src={projectInfo?.customerProfileImageUrl} />
              <Box>
                <Text fontSize="sm" fontWeight="bold">
                  {projectInfo?.customerOrgName}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {projectInfo?.customerOwnerName} (
                  {projectInfo?.customerJobTitle},{" "}
                  {projectInfo?.customerJobRole})
                </Text>
              </Box>
            </HStack>
            <Flex alignItems="center" minWidth="110px">
              <Phone size={14} color="gray" />
              <Text fontSize="sm" ml={1}>
                {projectInfo?.customerPhoneNum}
              </Text>
            </Flex>
          </HStack>
        </Box>

        {/* 프로젝트 일정 정보 */}
        <Box
          p={2}
          borderRadius="md"
          bg="gray.50"
          boxSizing="content-box"
          padding="1rem"
        >
          <Text
            fontSize="1.1rem"
            paddingBottom="0.5rem"
            fontWeight="bold"
            mb={1}
          >
            {" "}
            📅 프로젝트 일정
          </Text>
          <VStack align="start" gap="0.3rem">
            <Text fontSize="sm">
              🚀 시작일: {formatDynamicDate(projectInfo?.startAt) || "정보없음"}
            </Text>
            <Text fontSize="sm">
              ⏳ 마감일:{" "}
              {formatDynamicDate(projectInfo?.deadlineAt) || "정보없음"}
            </Text>
            <Text fontSize="sm">
              ✅ 종료일: {formatDynamicDate(projectInfo?.closeAt) || "정보없음"}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
