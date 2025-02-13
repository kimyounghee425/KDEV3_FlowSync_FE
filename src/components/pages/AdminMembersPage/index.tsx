"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  createListCollection,
  Heading,
  Stack,
  Table,
} from "@chakra-ui/react";
import { Switch } from "@/src/components/ui/switch";
import CommonTable from "@/src/components/common/CommonTable";
import Pagination from "@/src/components/common/Pagination";
import { formatDynamicDate } from "@/src/utils/formatDateUtil";
import SearchSection from "@/src/components/common/SearchSection";
import FilterSelectBox from "@/src/components/common/FilterSelectBox";
import { useMemberList } from "@/src/hook/useFetchBoardList";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import { activateMemberApi, deactivateMemberApi } from "@/src/api/members";
import { MemberProps } from "@/src/types";

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
    { label: "삭제됨", value: "DELETED" },
  ],
});

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "관리자",
  MEMBER: "일반회원",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "활성화",
  INACTIVE: "비활성화",
  DELETED: "삭제됨",
};

// const renderStatusSwitch = (status: string) => {
//   if (status === "DELETED") {
//     return <Switch disabled>Activate Chakra</Switch>; // 삭제된 경우, 비활성화된 Switch
//   }
//   return <Switch checked={status === "ACTIVE"} />;
// };

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
    error: memberListError,
  } = useMemberList(keyword, role, status, currentPage, pageSize);

  // ✅ 상태 변경을 위한 로컬 상태 추가
  const [memberData, setMemberData] = useState<MemberProps[]>([]);
  useEffect(() => {
    if (memberList) {
      setMemberData(memberList);
    }
  }, [memberList]);
  const [loadingId, setLoadingId] = useState<string | null>(null); // ✅ 특정 회원의 Switch 로딩 상태

  // ✅ 회원 상태 변경 핸들러 (API 호출 및 UI 반영)
  const handleStatusChange = async (
    memberId: string,
    currentStatus: string,
  ) => {
    setLoadingId(memberId); // ✅ 변경 중인 ID 설정 (로딩 표시)

    try {
      if (currentStatus === "ACTIVE") {
        await deactivateMemberApi(memberId); // 비활성화 API 호출
      } else {
        await activateMemberApi(memberId); // 활성화 API 호출
      }

      alert("회원 상태가 변경되었습니다.");

      // ✅ API 호출 후 로컬 상태 업데이트 (UI 즉시 반영)
      setMemberData((prevMembers) =>
        (prevMembers || []).map((member) =>
          member.id === memberId
            ? {
                ...member,
                status: currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE",
              }
            : member,
        ),
      );
    } catch (error) {
      console.error("회원 상태 변경 실패:", error);
      alert("회원 상태 변경 중 오류가 발생했습니다.");
    } finally {
      setLoadingId(null); // ✅ 로딩 해제
    }
  };

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
    router.push(`/admin/members/${id}`);
  };

  return (
    <>
      <Stack width="full">
        <Heading size="2xl" color="gray.600">
          회원 관리
        </Heading>
        <Box display="flex" justifyContent="space-between">
          <Button
            variant={"surface"}
            _hover={{ backgroundColor: "#00a8ff", color: "white" }}
            onClick={handleMemberCreateButton}
          >
            신규 등록
          </Button>
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
        </Box>
        {memberListError && (
          <ErrorAlert message="공지사항 목록을 불러오지 못했습니다. 다시 시도해주세요." />
        )}
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
          data={memberData} // 로컬 상태 활용
          loading={memberListLoading}
          renderRow={(member: MemberProps) => (
            <>
              <Table.Cell>
                {ROLE_LABELS[member.role] || "알 수 없음"}
              </Table.Cell>
              <Table.Cell>{member.name}</Table.Cell>
              <Table.Cell>{member.organizationName}</Table.Cell>
              <Table.Cell>{`${member.jobRole} | ${member.jobTitle}`}</Table.Cell>
              <Table.Cell>{member.email}</Table.Cell>
              <Table.Cell>{member.phoneNum}</Table.Cell>
              <Table.Cell onClick={(event) => event.stopPropagation()}>
                {member.status === "DELETED" ? (
                  <Switch disabled />
                ) : (
                  <Switch
                    checked={member.status === "ACTIVE"}
                    onChange={(event) => {
                      event.stopPropagation();
                      handleStatusChange(member.id, member.status);
                    }}
                    disabled={loadingId === member.id} // ✅ 상태 변경 시 로딩 적용
                  />
                )}
              </Table.Cell>
              <Table.Cell>{formatDynamicDate(member.regAt)}</Table.Cell>
            </>
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
