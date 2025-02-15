"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  createListCollection,
  Heading,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { Switch } from "@/src/components/ui/switch";
import CommonTable from "@/src/components/common/CommonTable";
import Pagination from "@/src/components/common/Pagination";
import { useOrganizationList } from "@/src/hook/useFetchBoardList";
import SearchSection from "@/src/components/common/SearchSection";
import FilterSelectBox from "@/src/components/common/FilterSelectBox";
import { formatDynamicDate } from "@/src/utils/formatDateUtil";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import DropDownMenu from "@/src/components/common/DropDownMenu";
import { deleteOriginationWithReason } from "@/src/api/organizations";
import { useUpdateOrganizationStatus } from "@/src/hook/useMutationData";

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
    error: organizationListError,
    refetch,
  } = useOrganizationList(keyword, type, status, currentPage, pageSize);

  const [loadingId, setLoadingId] = useState<string | null>(null); // 특정 업체의 Switch 로딩 상태

  // 업체 상태 변경 훅
  const { mutate: updateOrganizationStatus } = useUpdateOrganizationStatus();

  // 업체 상태 변경 핸들러
  const handleStatusChange = async (organizationId: string) => {
    setLoadingId(organizationId);
    try {
      await updateOrganizationStatus(organizationId);
      refetch();
    } finally {
      setLoadingId(null);
    }
  };

  // 신규등록 버튼 클릭 시 - 업체 등록 페이지로 이동
  const handleMemberCreateButton = () => {
    router.push("/admin/organizations/create");
  };

  // 페이지 변경 시 새로운 데이터를 가져오는 함수
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("currentPage", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
  };

  const handleRowClick = (id: string) => {
    router.push(`/admin/organizations/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/organizations/${id}`);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;
    try {
      await deleteOriginationWithReason(id, "");
      alert("업체가 삭제 조치 되었습니다.");
      router.refresh();
    } catch (error) {
      alert(`삭제 중 문제가 발생했습니다 : ${error}`);
    }
  };

  return (
    <>
      <Stack width="full">
        <Heading size="2xl" color="gray.600">
          업체 관리
        </Heading>
        <Box display="flex" justifyContent="space-between">
          <Button
            variant={"surface"}
            _hover={{ backgroundColor: "#00a8ff", color: "white" }}
            onClick={handleMemberCreateButton}
          >
            신규 등록
          </Button>
          <SearchSection keyword={keyword} placeholder="업체명 입력">
            <FilterSelectBox
              statusFramework={organizationTypeFramework}
              selectedValue={type}
              queryKey="type"
              placeholder="업체유형"
            />
            <FilterSelectBox
              statusFramework={OrganizationStatusFramework}
              selectedValue={status}
              queryKey="status"
              placeholder="활성화 여부"
            />
          </SearchSection>
        </Box>
        {organizationListError && (
          <ErrorAlert message="업체 목록을 불러오지 못했습니다. 다시 시도해주세요." />
        )}
        <CommonTable
          columnsWidth={
            <>
              <Table.Column htmlWidth="8%" />
              <Table.Column htmlWidth="12%" />
              <Table.Column htmlWidth="12%" />
              <Table.Column htmlWidth="12%" />
              <Table.Column htmlWidth="30%" />
              <Table.Column htmlWidth="12%" />
              <Table.Column htmlWidth="8%" />
              <Table.Column htmlWidth="6%" />
            </>
          }
          headerTitle={
            <Table.Row
              backgroundColor={"#eee"}
              css={{
                "& > th": { textAlign: "center", whiteSpace: "nowrap" },
              }}
            >
              <Table.ColumnHeader>업체유형</Table.ColumnHeader>
              <Table.ColumnHeader>업체명</Table.ColumnHeader>
              <Table.ColumnHeader>사업자등록번호</Table.ColumnHeader>
              <Table.ColumnHeader>연락처</Table.ColumnHeader>
              <Table.ColumnHeader>주소</Table.ColumnHeader>
              <Table.ColumnHeader>등록일</Table.ColumnHeader>
              <Table.ColumnHeader>상태</Table.ColumnHeader>
              <Table.ColumnHeader>관리</Table.ColumnHeader>
            </Table.Row>
          }
          data={organizationList ?? []}
          loading={organizationListLoading}
          renderRow={(organization) => (
            <Table.Row
              key={organization.id}
              onClick={() => handleRowClick(organization.id)}
              css={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" },
                "& > td": {
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            >
              <Table.Cell>{TYPE_LABELS[organization.type]}</Table.Cell>
              <Table.Cell>{organization.name}</Table.Cell>
              <Table.Cell>{organization.brNumber}</Table.Cell>
              <Table.Cell>{organization.phoneNumber}</Table.Cell>
              <Table.Cell>
                {`${organization.streetAddress} ${organization.detailAddress}`}
              </Table.Cell>
              <Table.Cell onClick={(event) => event.stopPropagation()}>
                {organization.status === "DELETED" ? (
                  <Text color="red">삭제됨</Text>
                ) : (
                  <Switch
                    checked={organization.status === "ACTIVE"}
                    onChange={(event) => {
                      event.stopPropagation();
                      handleStatusChange(organization.id);
                    }}
                    disabled={loadingId === organization.id} // ✅ 상태 변경 시 로딩 적용
                  />
                )}
              </Table.Cell>
              <Table.Cell>{formatDynamicDate(organization.regAt)}</Table.Cell>
              {/* <Table.Cell>
                <StatusTag>
                  {STATUS_LABELS[organization.status] || "-"}
                </StatusTag>
              </Table.Cell> */}
              <Table.Cell onClick={(event) => event.stopPropagation()}>
                <DropDownMenu
                  onEdit={() => handleEdit(organization.id)}
                  onDelete={() => handleDelete(organization.id)}
                />
              </Table.Cell>
            </Table.Row>
          )}
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
