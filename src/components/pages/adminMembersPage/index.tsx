"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Heading, Stack, Table } from "@chakra-ui/react";
import StatusTag from "@/src/components/common/StatusTag";
import MembersSearchSection from "@/src/components/common/MembersSearchSection";
import { useMemberList } from "@/src/hook/useMemberList";
import CommonTable from "@/src/components/common/CommonTable";
import Pagination from "@/src/components/common/Pagination";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "활성화",
  INACTIVE: "비활성화",
};

export default function AdminMembersPage() {
  return (
    <Suspense>
      <AdminMembersPageContent />
    </Suspense>
  );
}

function AdminMembersPageContent() {
  const { memberList, paginationMeta, loading, fetchMemberList } =
    useMemberList();
  const router = useRouter();

  // 페이지 변경 시 새로운 데이터를 가져오는 함수
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("page", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
    // 데이터를 다시 가져오기
    fetchMemberList(page, paginationMeta?.pageSize || 10);
  };

  const handleRowClick = (id: string) => {
    router.push(`/admins/members/${id}`);
  };

  return (
    <>
      <Stack width="full">
        <Heading size="2xl" color="gray.600">
          회원 관리
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
          data={memberList}
          loading={loading}
          renderRow={(member) => (
            <>
              <Table.Cell>{member.name}</Table.Cell>
              <Table.Cell>{member.organizationId}</Table.Cell>
              <Table.Cell>{member.jobRole}</Table.Cell>
              <Table.Cell>{member.email}</Table.Cell>
              <Table.Cell>{member.phoneNum}</Table.Cell>
              <Table.Cell>
                <StatusTag>
                  {STATUS_LABELS[member.status] || "알 수 없음"}
                </StatusTag>
              </Table.Cell>
            </>
          )}
          handleRowClick={handleRowClick}
        />
        {paginationMeta && (
          <Pagination
            paginationInfo={paginationMeta}
            handlePageChange={handlePageChange}
          />
        )}
      </Stack>
    </>
  );
}
