import { Box, Heading, Table } from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";
import { useNoticeList } from "@/src/hook/useNoticeList";
import { useRouter } from "next/navigation";
import StatusTag from "@/src/components/common/StatusTag";

export default function NoticesPage() {
  const { noticeList, loading } = useNoticeList();

  const router = useRouter();

  const handleRowClick = (id: string) => {
    router.push(`/projects/${id}/tasks`);
  };

  return (
    <Box>
      <Heading size="2xl" color="gray.700" mb="10px">
        공지사항
      </Heading>
      <CommonTable
        headerTitle={
          <Table.Row
            backgroundColor={"#eee"}
            css={{
              "& > th": { textAlign: "center" },
            }}
          >
            <Table.ColumnHeader>카테고리</Table.ColumnHeader>
            <Table.ColumnHeader>제목</Table.ColumnHeader>
            <Table.ColumnHeader>우선순위</Table.ColumnHeader>
            <Table.ColumnHeader>등록일</Table.ColumnHeader>
          </Table.Row>
        }
        data={noticeList}
        loading={loading}
        renderRow={(notice) => (
          <>
            <Table.Cell>{notice.category}</Table.Cell>
            <Table.Cell>{notice.title}</Table.Cell>
            <Table.Cell>
              <StatusTag>{notice.priority}</StatusTag>
            </Table.Cell>
            <Table.Cell>{notice.regAt}</Table.Cell>
          </>
        )}
        handleRowClick={handleRowClick}
      />
    </Box>
  );
}
