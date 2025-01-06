import { Box, Flex, Table } from "@chakra-ui/react";
import BasicTable from "../components/common/BasicTable";
import SearchSection from "../components/common/SearchSection";
import StatusCards from "../components/common/StatusCards";
import data from "../data/projects_mock_data.json";
export default function Home() {
  return (
    <>
      <StatusCards title={"프로젝트 현황"} />
      <SearchSection />
      <BasicTable
        headerTitle={
          <Table.Row backgroundColor={"#bebaba"}>
            <Table.ColumnHeader>프로젝트명</Table.ColumnHeader>
            <Table.ColumnHeader>고객사</Table.ColumnHeader>
            <Table.ColumnHeader>개발사</Table.ColumnHeader>
            <Table.ColumnHeader>계약 단계</Table.ColumnHeader>
            <Table.ColumnHeader>진행 단계</Table.ColumnHeader>
            <Table.ColumnHeader>프로젝트 시작일</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">프로젝트 종료일</Table.ColumnHeader>
          </Table.Row>
        }
      >
        {data.map(item => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.projectName}</Table.Cell>
            <Table.Cell>{item.client}</Table.Cell>
            <Table.Cell>{item.developer}</Table.Cell>
            <Table.Cell>{item.contractStage}</Table.Cell>
            <Table.Cell>{item.progressStage}</Table.Cell>
            <Table.Cell>{item.startDate}</Table.Cell>
            <Table.Cell textAlign="end">{item.endDate}</Table.Cell>
          </Table.Row>
        ))}
      </BasicTable>
    </>
  );
}
