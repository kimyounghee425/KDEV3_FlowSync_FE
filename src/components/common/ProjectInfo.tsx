import { ProjectInfoDataType } from "@/src/types/project";
import { Flex, Separator } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";

export default function ProjectInfo({ data }: { data: ProjectInfoDataType }) {
  return (
    <Flex alignItems="center" gap="12px">
      <Flex alignItems="center" gap="8px">
        {data.jobRole} <Avatar size="xs" src={data.profileImageUrl} />
        {data.name} {data.jobTitle}
      </Flex>
      <Separator orientation="vertical" height="6" />
      <Flex>담당자 연락처 {data.phoneNum}</Flex>
      <Separator orientation="vertical" height="6" />
      <Flex>프로젝트 시작일 {data.projectStartAt}</Flex>
      <Separator orientation="vertical" height="6" />
      <Flex>프로젝트 시작일 {data.projectCloseAt}</Flex>
    </Flex>
  );
}
