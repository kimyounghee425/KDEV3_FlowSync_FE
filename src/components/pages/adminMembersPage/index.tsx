"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  createListCollection,
  Heading,
  Stack,
  Table,
} from "@chakra-ui/react";
import StatusTag from "@/src/components/common/StatusTag";
import CommonTable from "@/src/components/common/CommonTable";
import Pagination from "@/src/components/common/Pagination";
import { formatDateWithTime } from "@/src/utils/formatDateUtil";
import SearchSection from "@/src/components/common/SearchSection";
import FilterSelectBox from "@/src/components/common/FilterSelectBox";
import { MemberListResponse } from "@/src/types";
import { useFetchBoardList } from "@/src/hook/useFetchBoardList";
import { fetchMemberList as fetchMemberListApi } from "@/src/api/members";

const memberRoleFramework = createListCollection<{
  label: string;
  value: string;
}>({
  items: [
    { label: "전체", value: "" },
    { label: "관리자", value: "ADMIN" },
    { label: "일반회원", value: "MEMBER" },
  ],
});

const memberStatusFramework = createListCollection<{
  label: string;
  value: string;
}>({
  items: [
    { label: "전체", value: "" },
    { label: "활성화", value: "ACTIVE" },
    { label: "비활성화", value: "INACTIVE" },
  ],
});

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "관리자",
  MEMBER: "일반회원",
};

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
  const searchParams = useSearchParams();
  const router = useRouter();

  const keyword = searchParams?.get("keyword") || "";
  const role = searchParams?.get("role") || "";
  const status = searchParams?.get("status") || "";
  const currentPage = parseInt(searchParams?.get("currentPage") || "1", 10);
  const pageSize = parseInt(searchParams?.get("pageSize") || "10", 10);

  const {
    data: memberList,
    paginationInfo,
    loading: memberListLoading,
  } = useFetchBoardList<
    MemberListResponse,
    [string, string, string, number, number],
    "members"
  >({
    fetchApi: fetchMemberListApi,
    keySelector: "members",
    params: [keyword, role, status, currentPage, pageSize],
  });

  // 신규등록 버튼 클릭 시 - 회원 등록 페이지로 이동
  const handleMemberCreateButton = () => {
    router.push("/admin/members/create");
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
    router.push(`/admins/members/${id}`);
  };

  return (
    <>
      <Stack width="full">
        <Heading size="2xl" color="gray.600">
          회원 관리
        </Heading>
        <Box display="flex" justifyContent="space-between">
          <SearchSection keyword={keyword} placeholder="회원명 입력">
            <FilterSelectBox
              statusFramework={memberRoleFramework}
              selectedValue={role}
              queryKey="role"
            />
            <FilterSelectBox
              statusFramework={memberStatusFramework}
              selectedValue={status}
              queryKey="status"
            />
          </SearchSection>
          <Button
            variant={"surface"}
            _hover={{ backgroundColor: "#00a8ff", color: "white" }}
            onClick={handleMemberCreateButton}
          >
            신규 등록
          </Button>
        </Box>
        <CommonTable
          headerTitle={
            <Table.Row
              backgroundColor={"#eee"}
              css={{
                "& > th": { textAlign: "center" },
              }}
            >
              <Table.ColumnHeader>역할</Table.ColumnHeader>
              <Table.ColumnHeader>회원명</Table.ColumnHeader>
              <Table.ColumnHeader>소속 업체명</Table.ColumnHeader>
              <Table.ColumnHeader>직무 | 직책</Table.ColumnHeader>
              <Table.ColumnHeader>이메일</Table.ColumnHeader>
              <Table.ColumnHeader>연락처</Table.ColumnHeader>
              <Table.ColumnHeader>상태</Table.ColumnHeader>
              <Table.ColumnHeader>등록일</Table.ColumnHeader>
            </Table.Row>
          }
          data={memberList}
          loading={memberListLoading}
          renderRow={(member) => (
            <>
              <Table.Cell>
                {ROLE_LABELS[member.role] || "알 수 없음"}
              </Table.Cell>
              <Table.Cell>{member.name}</Table.Cell>
              <Table.Cell>{member.organizationName}</Table.Cell>
              <Table.Cell>{`${member.jobRole} | ${member.jobTitle}`}</Table.Cell>
              <Table.Cell>{member.email}</Table.Cell>
              <Table.Cell>{member.phoneNum}</Table.Cell>
              <Table.Cell>
                <StatusTag>
                  {STATUS_LABELS[member.status] || "알 수 없음"}
                </StatusTag>
              </Table.Cell>
              <Table.Cell>{formatDateWithTime(member.regAt)}</Table.Cell>
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
