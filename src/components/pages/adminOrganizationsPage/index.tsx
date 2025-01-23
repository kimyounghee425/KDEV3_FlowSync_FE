"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Heading, Stack, Table } from "@chakra-ui/react";
import { useOrganizationList } from "@/src/hook/useOrganizationList";
import StatusTag from "@/src/components/common/StatusTag";
import CommonTable from "@/src/components/common/CommonTable";
import OrganizationsSearchSection from "@/src/components/pages/adminOrganizationsPage/components/OrganizationsSearchSection";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "활성화",
  INACTIVE: "비활성화",
};

export default function AdminOrganizationsPage() {
  return (
    <Suspense>
      <AdminOrganizationsPageContent />
    </Suspense>
  );
}

function AdminOrganizationsPageContent() {
  const { organizationList, loading, fetchBoardList } = useOrganizationList();
  const router = useRouter();

  // 페이지 변경 시 새로운 데이터를 가져오는 함수
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("page", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
    // // 데이터를 다시 가져오기
    // fetchBoardList(page, paginationInfo?.pageSize || 5);
  };

  const handleRowClick = (id: string) => {
    router.push(`/admins/members/${id}`);
  };

  return (
    <>
      <Stack width="full">
        <Heading size="2xl" color="gray.600">
          업체 관리
        </Heading>
        <OrganizationsSearchSection />
        <CommonTable
          headerTitle={
            <Table.Row
              backgroundColor={"#eee"}
              css={{
                "& > th": { textAlign: "center" },
              }}
            >
              <Table.ColumnHeader>업체명</Table.ColumnHeader>
              <Table.ColumnHeader>업체유형</Table.ColumnHeader>
              <Table.ColumnHeader>연락처</Table.ColumnHeader>
              <Table.ColumnHeader>주소</Table.ColumnHeader>
              <Table.ColumnHeader>상태</Table.ColumnHeader>
            </Table.Row>
          }
          data={organizationList}
          loading={loading}
          renderRow={(organization) => (
            <>
              <Table.Cell>{organization.name}</Table.Cell>
              <Table.Cell>{organization.type}</Table.Cell>
              <Table.Cell>{organization.phone_number}</Table.Cell>
              <Table.Cell>{`${organization.streetAddress} ${organization.detailAddress}`}</Table.Cell>
              <Table.Cell>
                <StatusTag>
                  {STATUS_LABELS[organization.status] || "알 수 없음"}
                </StatusTag>
              </Table.Cell>
            </>
          )}
          handleRowClick={handleRowClick}
        />
        {/* {paginationInfo && <Pagination paginationInfo={paginationInfo} handlePageChange={handlePageChange} />} */}
      </Stack>
    </>
  );
}
