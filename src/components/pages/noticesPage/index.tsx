"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  createListCollection,
  Flex,
  Heading,
  Table,
} from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";
import { fetchNoticeList as fetchNoticeListApi } from "@/src/api/notices";
import { NoticeListResponse, UserInfoResponse } from "@/src/types";
import { useFetchBoardList } from "@/src/hook/useFetchBoardList";
import SearchSection from "@/src/components/common/SearchSection";
import FilterSelectBox from "@/src/components/common/FilterSelectBox";
import Pagination from "@/src/components/common/Pagination";
import { formatDateWithTime } from "@/src/utils/formatDateUtil";
import { fetchUserInfo as fetchUserInfoApi } from "@/src/api/auth";
import { useFetchData } from "@/src/hook/useFetchData";
import CreateButton from "@/src/components/common/CreateButton";

const noticeStatusFramework = createListCollection<{
  label: string;
  value: string;
}>({
  items: [
    { label: "전체", value: "" },
    { label: "서비스 업데이트", value: "SERVICE_UPDATE" },
    { label: "정책변경", value: "POLICY_CHANGE" },
    { label: "점검안내", value: "MAINTENANCE" },
    { label: "기타", value: "OTHER" },
  ],
});

const EMERGENCY_STYLE = {
  backgroundColor: "gray.200", // 🔹 기존 red.100 → 자연스러운 회색 계열
  fontWeight: "bold",
};

export default function NoticesPage() {
  return (
    <Suspense>
      <NoticesPageContent />
    </Suspense>
  );
}

function NoticesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const keyword = searchParams?.get("keyword") || "";
  const category = searchParams?.get("category") || "";
  const currentPage = parseInt(searchParams?.get("currentPage") || "1", 10);
  const pageSize = parseInt(searchParams?.get("pageSize") || "5", 10);

  const { data: userInfoData } = useFetchData<UserInfoResponse, []>({
    fetchApi: fetchUserInfoApi,
    params: [],
  });

  const userRole = userInfoData?.role;

  const {
    data: noticeList,
    paginationInfo,
    loading: noticeLoading,
  } = useFetchBoardList<
    NoticeListResponse,
    [string, string, number, number],
    "notices"
  >({
    fetchApi: fetchNoticeListApi,
    keySelector: "notices",
    params: [keyword, category, currentPage, pageSize],
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("currentPage", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
  };

  const handleRowClick = (noticeId: string) => {
    router.push(`/notices/${noticeId}`);
  };

  // 신규등록 버튼 클릭 시 - 공지사항 등록 페이지로 이동
  const handleNoticeCreateButton = () => {
    router.push(`/notices/new`);
  };

  return (
    <Box>
      <Heading size="2xl" color="gray.700" mb="10px">
        공지사항
      </Heading>

      {userRole === "ADMIN" ? (
        <Flex justifyContent="space-between">
          <CreateButton handleButton={handleNoticeCreateButton} />
          {/* 프로젝트 검색/필터 섹션 (검색창, 필터 옵션 등) */}
          <SearchSection keyword={keyword} placeholder="제목 입력">
            <FilterSelectBox
              statusFramework={noticeStatusFramework}
              selectedValue={category}
              queryKey="category"
            />
          </SearchSection>
        </Flex>
      ) : (
        <Flex justifyContent="end">
          {/* 프로젝트 검색/필터 섹션 (검색창, 필터 옵션 등) */}
          <SearchSection keyword={keyword} placeholder="제목 입력">
            <FilterSelectBox
              statusFramework={noticeStatusFramework}
              selectedValue={category}
              queryKey="status"
            />
          </SearchSection>
        </Flex>
      )}

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
            <Table.ColumnHeader>등록일</Table.ColumnHeader>
            {userRole === "ADMIN" ? (
              <>
                <Table.ColumnHeader>수정일</Table.ColumnHeader>
                <Table.ColumnHeader>삭제여부</Table.ColumnHeader>
              </>
            ) : (
              <></>
            )}
          </Table.Row>
        }
        data={noticeList}
        loading={noticeLoading}
        renderRow={(notice) => {
          const isEmergency = notice.priority === "EMERGENCY";
          return (
            <>
              <Table.Cell {...(isEmergency ? EMERGENCY_STYLE : {})}>
                {notice.category}
              </Table.Cell>
              <Table.Cell {...(isEmergency ? EMERGENCY_STYLE : {})}>
                {notice.title}
              </Table.Cell>
              <Table.Cell {...(isEmergency ? EMERGENCY_STYLE : {})}>
                {formatDateWithTime(notice.regAt)}
              </Table.Cell>
              {userRole === "ADMIN" ? (
                <>
                  <Table.Cell {...(isEmergency ? EMERGENCY_STYLE : {})}>
                    {formatDateWithTime(notice.updatedAt)}
                  </Table.Cell>
                  <Table.Cell {...(isEmergency ? EMERGENCY_STYLE : {})}>
                    {notice.isDeleted === true ? "Y" : "N"}
                  </Table.Cell>
                </>
              ) : (
                <></>
              )}
            </>
          );
        }}
        handleRowClick={handleRowClick}
      />
      <Pagination
        paginationInfo={
          paginationInfo && {
            ...paginationInfo,
            currentPage: paginationInfo.currentPage,
          }
        }
        handlePageChange={handlePageChange}
      />
    </Box>
  );
}
