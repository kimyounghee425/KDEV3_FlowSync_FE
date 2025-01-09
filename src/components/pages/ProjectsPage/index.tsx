import { Table } from "@chakra-ui/react";
import BasicTable from "@/src/components/common/BasicTable";
import ProjectStatusCards from "@/src/components/common/ProjectsStatusCards";
import Head from "next/head";
import { ProjectsFilterProvider } from "@/src/context/ProjectsFilterContext";

export default function Home() {
  return (
    <ProjectsFilterProvider>
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
      <BasicTable
        headerTitle={
          <Table.Row
            backgroundColor={"#eee"}
            css={{
              "& > th": {
                // 모든 자식 `th` 태그에 스타일 적용
                textAlign: "center",
              },
            }}
          >
            <Table.ColumnHeader>프로젝트명</Table.ColumnHeader>
            <Table.ColumnHeader>고객사</Table.ColumnHeader>
            <Table.ColumnHeader>개발사</Table.ColumnHeader>
            <Table.ColumnHeader>프로젝트 상태</Table.ColumnHeader>
            <Table.ColumnHeader>진행 단계</Table.ColumnHeader>
            <Table.ColumnHeader>프로젝트 시작일</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">
              프로젝트 종료일
            </Table.ColumnHeader>
          </Table.Row>
        }
      />
    </ProjectsFilterProvider>
  );
}
