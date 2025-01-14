"use client";

import { Box, Flex, Heading, HStack, Table } from "@chakra-ui/react";
import { SegmentedControl } from "../../ui/segmented-control";
import { Layers, List } from "lucide-react";
import ProjectInfo from "../../common/ProjectInfo";
import ProgressSection from "../../common/ProgressStepSection";
import { Loading } from "../../common/Loading";
import { ProjectsProvider } from "@/src/context/ProjectsContext";
import { useProjectData } from "@/src/hook/useProjectData";
import SearchSection from "../../common/SearchSection";
import CommonTable from "../../common/CommonTable";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default function ProjectPage({ params }: ProjectPageProps) {
  const { projectId, data, loading, error } = useProjectData(params);

  if (loading) return <Loading />;
  if (error || !data || !projectId)
    return <Box>Error: {error || "No data found"}</Box>;

  return (
    <ProjectsProvider>
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
          <Heading size={"4xl"}>{data.projectTitle}</Heading>
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
        <ProjectInfo data={data} />
      </Flex>
      <ProgressSection projectId={projectId} />
      <Box
        direction="column"
        padding="30px 23px"
        gap="8px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="md"
        mb="30px">
        <SearchSection />
        {/* <CommonTable
          headerTitle={
            <Table.Row
              backgroundColor={"#eee"}
              css={{
                "& > th": { textAlign: "center" },
              }}>
              <Table.ColumnHeader>프로젝트명</Table.ColumnHeader>
              <Table.ColumnHeader>고객사</Table.ColumnHeader>
              <Table.ColumnHeader>개발사</Table.ColumnHeader>
              <Table.ColumnHeader>프로젝트 상태</Table.ColumnHeader>
              <Table.ColumnHeader>프로젝트 시작일</Table.ColumnHeader>
              <Table.ColumnHeader>프로젝트 종료일</Table.ColumnHeader>
            </Table.Row>
          }
          data={projectList}
          loading={loading}
          renderRow={(item) => (
            <>
              <Table.Cell>{item.projectName}</Table.Cell>
              <Table.Cell>{item.client}</Table.Cell>
              <Table.Cell>{item.developer}</Table.Cell>
              <Table.Cell>
                <CustomBox>{item.projectStatus}</CustomBox>
              </Table.Cell>
              <Table.Cell>{item.startAt}</Table.Cell>
              <Table.Cell>{item.closeAt}</Table.Cell>
            </>
          )}
        /> */}
      </Box>
    </ProjectsProvider>
  );
}
