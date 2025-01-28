"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createListCollection, Heading, Stack, Table } from "@chakra-ui/react";
import StatusTag from "@/src/components/common/StatusTag";
import CommonTable from "@/src/components/common/CommonTable";
import Pagination from "@/src/components/common/Pagination";
import { useFetchBoardList } from "@/src/hook/useFetchBoardList";
import { OrganizationListResponse } from "@/src/types";
import { fetchOrganizationList as fetchOrganizationListApi } from "@/src/api/organizations";
import SearchSection from "@/src/components/common/SearchSection";
import FilterSelectBox from "@/src/components/common/FilterSelectBox";

const organizationTypeFramework = createListCollection<{
  label: string;
  value: string;
}>({
  items: [
    { label: "전체", value: "" },
    { label: "고객사", value: "CUSTOMER" },
    { label: "개발사", value: "DEVELOPER" },
  ],
});

const OrganizationStatusFramework = createListCollection<{
  label: string;
  value: string;
}>({
  items: [
    { label: "전체", value: "" },
    { label: "활성화", value: "ACTIVE" },
    { label: "비활성화", value: "INACTIVE" },
  ],
});

const TYPE_LABELS: Record<string, string> = {
  CUSTOMER: "고객사",
  DEVELOPER: "개발사",
};

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
  const searchParams = useSearchParams();
  const router = useRouter();

  const keyword = searchParams?.get("keyword") || "";
  const type = searchParams?.get("type") || "";
  const status = searchParams?.get("status") || "";
  const currentPage = parseInt(searchParams?.get("currentPage") || "1", 10);
  const pageSize = parseInt(searchParams?.get("pageSize") || "10", 10);

  const {
    data: organizationList,
    paginationInfo,
    loading: organizationListLoading,
  } = useFetchBoardList<
    OrganizationListResponse,
    [string, string, string, number, number],
    "organizations"
  >({
    fetchApi: fetchOrganizationListApi,
    keySelector: "organizations",
    params: [keyword, type, status, currentPage, pageSize],
    dependencies: [keyword, type, status, currentPage, pageSize],
  });

  // 페이지 변경 시 새로운 데이터를 가져오는 함수
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("currentPage", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
  };

  const handleRowClick = (id: string) => {
    router.push(`/admins/organizations/${id}`);
  };

  return (
    <>
      <Stack width="full">
        <Heading size="2xl" color="gray.600">
          업체 관리
        </Heading>
        <SearchSection keyword={keyword} placeholder="업체명 입력">
          <FilterSelectBox
            statusFramework={organizationTypeFramework}
            selectedValue={type}
            queryKey="type"
          />
          <FilterSelectBox
            statusFramework={OrganizationStatusFramework}
            selectedValue={status}
            queryKey="status"
          />
        </SearchSection>
        <CommonTable
          headerTitle={
            <Table.Row
              backgroundColor={"#eee"}
              css={{
                "& > th": { textAlign: "center" },
              }}
            >
              <Table.ColumnHeader>업체유형</Table.ColumnHeader>
              <Table.ColumnHeader>업체명</Table.ColumnHeader>
              <Table.ColumnHeader>사업자등록번호</Table.ColumnHeader>
              <Table.ColumnHeader>연락처</Table.ColumnHeader>
              <Table.ColumnHeader>주소</Table.ColumnHeader>
              <Table.ColumnHeader>상태</Table.ColumnHeader>
            </Table.Row>
          }
          data={organizationList}
          loading={organizationListLoading}
          renderRow={(organization) => (
            <>
              <Table.Cell>
                {TYPE_LABELS[organization.type] || "알 수 없음"}
              </Table.Cell>
              <Table.Cell>{organization.name}</Table.Cell>
              <Table.Cell>{organization.brNumber}</Table.Cell>
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
        {paginationInfo && (
          <Pagination
            paginationInfo={paginationInfo}
            handlePageChange={handlePageChange}
          />
        )}
      </Stack>
    </>
  );
}
