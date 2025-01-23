"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Heading, Stack, Table } from "@chakra-ui/react";
import { useOrganizationList } from "@/src/hook/useOrganizationList";
import StatusTag from "@/src/components/common/StatusTag";
import MembersSearchSection from "../../common/MembersSearchSection";
import CommonTable from "../../common/CommonTable";

const STATUS_LABELS: Record<string, string> = {
  ING_WORK: "근무 O",
  STOP_WORK: "근무 X",
};

export default function AdminOrganizationsPage() {
  return (
    <Suspense>
      <AdminOrganizationsPageContent />
    </Suspense>
  );
}

function AdminOrganizationsPageContent() {
  const { organizationList, loading, fetchOrganizations } =
    useOrganizationList();
  const router = useRouter();

  // 페이지 변경 시 새로운 데이터를 가져오는 함수
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("page", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
    // // 데이터를 다시 가져오기
    // fetchMemberList(page, paginationInfo?.pageSize || 5);
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
        <MembersSearchSection />
        <CommonTable
          headerTitle={
            <Table.Row
              backgroundColor={"#eee"}
              css={{
                "& > th": { textAlign: "center" },
              }}
            >
              <Table.ColumnHeader>회원명</Table.ColumnHeader>
              <Table.ColumnHeader>소속 업체명</Table.ColumnHeader>
              <Table.ColumnHeader>직무</Table.ColumnHeader>
              <Table.ColumnHeader>이메일</Table.ColumnHeader>
              <Table.ColumnHeader>연락처</Table.ColumnHeader>
              <Table.ColumnHeader>근무 상태</Table.ColumnHeader>
            </Table.Row>
          }
          data={organizationList}
          loading={loading}
          renderRow={(organization) => (
            <>
              <Table.Cell>{organization.name}</Table.Cell>
              <Table.Cell>{organization.organizationId}</Table.Cell>
              <Table.Cell>{organization.jobRole}</Table.Cell>
              <Table.Cell>{organization.email}</Table.Cell>
              <Table.Cell>{organization.phoneNum}</Table.Cell>
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
