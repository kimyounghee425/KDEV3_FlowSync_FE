import { Flex, Separator } from "@chakra-ui/react";
import { Avatar } from "@/src/components/ui/avatar";
import { ProjectInfoProps } from "@/src/types";
import { formatDateToISODate } from "@/src/utils/formatDateUtil";

// 프로젝트 기본정보 컴포넌트
export default function ProjectInfo({
  projectInfo,
}: {
  projectInfo: ProjectInfoProps | null;
}) {
  return (
    <Flex alignItems="center" gap="12px">
      <Flex alignItems="center" gap="8px">
        {projectInfo?.jobRole}{" "}
        <Avatar size="xs" src={projectInfo?.profileImageUrl} />
        {projectInfo?.memberName} {projectInfo?.jobTitle}
      </Flex>
      <Separator orientation="vertical" height="6" />
      <Flex>담당자 연락처 {projectInfo?.phoneNum}</Flex>
      <Separator orientation="vertical" height="6" />
      <Flex>프로젝트 시작일 {formatDateToISODate(projectInfo?.startAt)}</Flex>
      <Separator orientation="vertical" height="6" />
      <Flex>프로젝트 시작일 {formatDateToISODate(projectInfo?.closeAt)}</Flex>
    </Flex>
  );
}
