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
export default function ProjectInfoSection222({
  projectInfo,
  loading,
}: ProjectInfoSectionProps) {
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {/* 고객사 정보 */}
      <Box flex="1" borderRadius="md" bg="gray.50" boxSizing="content-box">
        <HStack justifyContent="space-between">
          <HStack gap="1rem">
            <Text>🏢 고객사</Text>
            <Text>|</Text>
            <Box>
              <Text fontSize="0.9rem" fontWeight="bold">
                {projectInfo?.customerOrgName}
              </Text>
              <Text fontSize="0.8rem" color="gray.700">
                {projectInfo?.customerOwnerName} |{" "}
                {projectInfo?.customerJobTitle} |{" "}
                {projectInfo?.developerJobRole}
              </Text>
              <Text fontSize="0.8rem" color="gray.700" marginLeft="0.2rem">
                {projectInfo?.developerPhoneNum}
              </Text>
            </Box>
          </HStack>
        </HStack>
      </Box>
      {/* 개발사 정보 */}
      <Box flex="1" borderRadius="md" bg="gray.50" boxSizing="content-box">
        <HStack justifyContent="space-between">
          <HStack gap="1rem">
            <Text>🔧 개발사</Text>
            <Text>|</Text>
            <Box>
              <Text fontSize="0.9rem" fontWeight="bold">
                {projectInfo?.developerOrgName}
              </Text>
              <Text fontSize="0.8rem" color="gray.700">
                {projectInfo?.developerOwnerName} |{" "}
                {projectInfo?.developerJobTitle} |{" "}
                {projectInfo?.customerJobRole}
              </Text>
              <Text fontSize="0.8rem" color="gray.700" marginLeft="0.2rem">
                {projectInfo?.developerPhoneNum}
              </Text>
            </Box>
          </HStack>
        </HStack>
      </Box>
      {/* 프로젝트 일정 정보 */}
      <Box flex="1" borderRadius="md" bg="gray.50" boxSizing="content-box">
        <HStack justifyContent="space-between">
          <HStack gap="1rem">
            <Text>📅 프로젝트 일정</Text>
            <Text>|</Text>
            <Box>
              <Text fontSize="0.9rem">
                시작일: {formatDynamicDate(projectInfo?.startAt) || "-"}
              </Text>
              <Text fontSize="0.9rem">
                마감일: {formatDynamicDate(projectInfo?.deadlineAt) || "-"}
              </Text>{" "}
              <Text fontSize="0.9rem">
                종료일: {formatDynamicDate(projectInfo?.closeAt) || "-"}
              </Text>
            </Box>
          </HStack>
        </HStack>
      </Box>
    </>
  );
}
