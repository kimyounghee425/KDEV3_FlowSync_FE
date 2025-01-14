"use client";

import { Heading, Stack, Table } from "@chakra-ui/react";
import ProjectStatusCards from "@/src/components/common/ProjectsStatusCards";
import Head from "next/head";
import {
  ProjectsProvider,
  useProjectsData,
} from "@/src/context/ProjectsContext";
import CommonTable from "../../common/CommonTable";
import SearchSection from "../../common/SearchSection";
import { CustomBox } from "../../common/CustomBox";
import { useEffect } from "react";
import Pagination from "../../common/Pagination";

export default function ProjectsPage() {
  return (
    <ProjectsProvider>
      <ProjectsPageContent />
    </ProjectsProvider>
  );
}

const ProjectsPageContent = () => {
  const { query, projectList, loading, paginationInfo, fetchData, filter } =
    useProjectsData();

  // 초기 데이터 로드
  useEffect(() => {
    fetchData();
  }, [query, filter]);

  // 페이지 변경 시 새로운 데이터를 가져오는 함수
  const handlePageChange = (page: number) => {
    fetchData(page, paginationInfo?.pageSize || 5);
  };

  return (
    <>
      <Head>
        <title>FlowSync</title>
        <meta property="og:image" content="@/public/FlowSyncLogo.jpg" />
        <meta property="og:title" content="FlowSync" />
        <meta
          property="og:description"
          content="FlowSync로 프로젝트 관리를 한번에"
        />
      </Head>
      <ProjectStatusCards title={"프로젝트 현황"} />
      <Stack width="full">
        <Heading size="2xl" color="gray.600">
          프로젝트 목록
        </Heading>
        <SearchSection />
        <CommonTable
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
        />
        <Pagination
          paginationInfo={
            paginationInfo && {
              ...paginationInfo,
              currentPage: paginationInfo.currentPage + 1,
            }
          }
          handlePageChange={handlePageChange}
        />
      </Stack>
    </>
  );
};
