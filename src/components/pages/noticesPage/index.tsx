"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Box, createListCollection, Heading, Table } from "@chakra-ui/react";
import CommonTable from "@/src/components/common/CommonTable";
import { fetchNoticeList as fetchNoticeListApi } from "@/src/api/notices";
import { NoticeListResponse } from "@/src/types";
import { useFetchBoardList } from "@/src/hook/useFetchBoardList";
import SearchSection from "@/src/components/common/SearchSection";
import FilterSelectBox from "@/src/components/common/FilterSelectBox";
import Pagination from "@/src/components/common/Pagination";
import { Suspense } from "react";

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
  const status = searchParams?.get("status") || "";
  const currentPage = parseInt(searchParams?.get("currentPage") || "1", 10);
  const pageSize = parseInt(searchParams?.get("pageSize") || "5", 10);

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
    params: [keyword, status, currentPage, pageSize],
    dependencies: [keyword, status, currentPage, pageSize],
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("currentPage", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
  };

  const handleRowClick = (id: string) => {
    router.push(`/notices/${id}`);
  };

  return (
    <Box>
      <Heading size="2xl" color="gray.700" mb="10px">
        공지사항
      </Heading>
      {/* 프로젝트 검색/필터 섹션 (검색창, 필터 옵션 등) */}
      <SearchSection keyword={keyword} placeholder="프로젝트명 입력">
        <FilterSelectBox
          statusFramework={noticeStatusFramework}
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
            <Table.ColumnHeader>카테고리</Table.ColumnHeader>
            <Table.ColumnHeader>제목</Table.ColumnHeader>
            <Table.ColumnHeader>등록일</Table.ColumnHeader>
          </Table.Row>
        }
        data={noticeList}
        loading={noticeLoading}
        renderRow={(notice) => (
          <>
            <Table.Cell>{notice.category}</Table.Cell>
            <Table.Cell>{notice.title}</Table.Cell>
            <Table.Cell>{notice.regAt}</Table.Cell>
          </>
        )}
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
