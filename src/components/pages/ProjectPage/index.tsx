"use client";

import { Box, Flex, Heading, HStack, Table, Text } from "@chakra-ui/react";
import { SegmentedControl } from "../../ui/segmented-control";
import { Layers, List } from "lucide-react";
import ProjectInfo from "../../common/ProjectInfo";
import ProgressStepSection from "../../common/ProgressStepSection";
import { useCallback, useEffect, useState } from "react";
import BoardSearchSection from "../../common/BoardSearchSection";
import CommonTable from "../../common/CommonTable";
import { useProjectBoard } from "@/src/hook/useProjectBoard";
import { CustomBox } from "../../common/CustomBox";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // const { projectId, projectInfo, loading } = useProjectInfo(params);

  // if (loading || !projectInfo) return <Loading />;

  const [projectId, setProjectId] = useState<string>();

  const { boardList, loading } = useProjectBoard();

  const getProjectId = useCallback(async () => {
    setProjectId((await params).projectId);
  }, [params]);
  useEffect(() => {
    getProjectId();
  }, [getProjectId]);

  const projectInfo = {
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

  return (
    <>
      <Flex
        direction="column"
        padding="30px 23px"
        gap="8px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="md"
        mb="30px">
        <Flex justifyContent={"space-between"}>
          <Flex gap="10px">
            <Heading size={"4xl"}>{projectInfo.projectTitle}</Heading>
            <Text fontWeight="500" color="#BBB" fontSize="20px">
              {projectInfo.description}
            </Text>
          </Flex>
          <SegmentedControl
            defaultValue="task"
            items={[
              {
                value: "task",
                label: (
                  <HStack>
                    <List />
                    업무관리
                  </HStack>
                ),
              },
              {
                value: "progress",
                label: (
                  <HStack>
                    <Layers />
                    진척관리
                  </HStack>
                ),
              },
            ]}
          />
        </Flex>
        <ProjectInfo projectInfo={projectInfo} />
      </Flex>
      <ProgressStepSection projectId={projectId as string} />
      <Box
        direction="column"
        padding="30px 23px"
        gap="8px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="md"
        mb="30px">
        <BoardSearchSection />
        <CommonTable
          headerTitle={
            <Table.Row
              backgroundColor={"#eee"}
              css={{
                "& > th": { textAlign: "center" },
              }}>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>작성일</Table.ColumnHeader>
              <Table.ColumnHeader>게시글 상태</Table.ColumnHeader>
              <Table.ColumnHeader>게시글 유형</Table.ColumnHeader>
            </Table.Row>
          }
          data={boardList}
          loading={loading}
          renderRow={(item) => (
            <>
              <Table.Cell>{item.title}</Table.Cell>
              <Table.Cell>{item.regAt}</Table.Cell>
              <Table.Cell>
                <CustomBox>{item.boardStatus}</CustomBox>
              </Table.Cell>
              <Table.Cell>
                <CustomBox>{item.boardCategory}</CustomBox>
              </Table.Cell>
            </>
          )}
        />
      </Box>
    </>
  );
}
