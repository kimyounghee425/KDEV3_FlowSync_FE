import { ProjectInfoType } from "@/src/types";
import { Flex, Separator } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";

export default function ProjectInfo({
  projectInfo,
}: {
  projectInfo: ProjectInfoType;
}) {
  return (
    <Flex alignItems="center" gap="12px">
      <Flex alignItems="center" gap="8px">
        {projectInfo.jobRole}{" "}
        <Avatar size="xs" src={projectInfo.profileImageUrl} />
        {projectInfo.name} {projectInfo.jobTitle}
      </Flex>
      <Separator orientation="vertical" height="6" />
      <Flex>담당자 연락처 {projectInfo.phoneNum}</Flex>
      <Separator orientation="vertical" height="6" />
      <Flex>프로젝트 시작일 {projectInfo.projectStartAt}</Flex>
      <Separator orientation="vertical" height="6" />
      <Flex>프로젝트 시작일 {projectInfo.projectCloseAt}</Flex>
    </Flex>
  );
}
