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
import SearchSection from "@/src/components/common/SearchSection";
import FilterSelectBox from "@/src/components/common/FilterSelectBox";
import Pagination from "@/src/components/common/Pagination";
import { formatDynamicDate } from "@/src/utils/formatDateUtil";
import CreateButton from "@/src/components/common/CreateButton";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import { useNoticeList } from "@/src/hook/useFetchBoardList";
import { useUserInfo } from "@/src/hook/useFetchData";
import DropDownMenu from "@/src/components/common/DropDownMenu";
import { useDeleteNotice } from "@/src/hook/useMutationData";

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

const noticeStatusOptions = createListCollection<{
  label: string;
  value: string;
}>({
  items: [
    { label: "모든 공지", value: "" },
    { label: "게시중", value: "N" },
    { label: "삭제된 공지", value: "Y" },
  ],
});

const CATEGORY_LABELS: Record<string, string> = {
  SERVICE_UPDATE: "서비스 업데이트",
  POLICY_CHANGE: "정책변경",
  MAINTENANCE: "점검안내",
  OTHER: "기타",
};

const PRIORITY_LABELS: Record<string, string> = {
  EMERGENCY: "긴급",
  NORMAL: "일반",
};

const EMERGENCY_STYLE = {
  fontWeight: "bold",
  color: "red",
};

const NOTICE_STATUS_LABELS: Record<string, string> = {
  Y: "삭제됨",
  N: "게시중",
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
  const isDeleted = searchParams?.get("isDeleted") || "";
  const currentPage = parseInt(searchParams?.get("currentPage") || "1", 10);
  const pageSize = parseInt(searchParams?.get("pageSize") || "10", 10);

  const { data: userInfoData } = useUserInfo();
  const userRole = userInfoData?.role;
  const { mutate: deleteNotice } = useDeleteNotice();

  const {
    data: noticeList,
    paginationInfo,
    loading: noticeListLoading,
    error: noticeListError,
    refetch,
  } = useNoticeList(keyword, category, isDeleted, currentPage, pageSize);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("currentPage", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
  };

  const handleRowClick = (noticeId: string) => {
    const params = new URLSearchParams(window.location.search);
    router.push(`/notices/${noticeId}?${params.toString()}`);
  };

  // 신규등록 버튼 클릭 시 - 공지사항 등록 페이지로 이동
  const handleNoticeCreateButton = () => {
    router.push(`/notices/new`);
  };

  const handleEdit = (noticeId: string) => {
    router.push(`/notices/${noticeId}/edit?${searchParams.toString()}`);
  };

  const handleDelete = async (noticeId: string) => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;
    try {
      await deleteNotice(noticeId);
      refetch();
    } catch (error) {}
  };

  return (
    <Box>
      <Heading size="2xl" color="gray.700" mb="10px">
        공지사항
      </Heading>

      {userRole === "ADMIN" ? (
        <Flex justifyContent="space-between">
          <CreateButton handleButton={handleNoticeCreateButton} />
          {/* 공지사항 검색/필터 섹션 (검색창, 필터 옵션 등) */}
          <SearchSection keyword={keyword} placeholder="제목 입력">
            <FilterSelectBox
              statusFramework={noticeStatusFramework}
              selectedValue={category}
              queryKey="category"
              placeholder="카테고리"
              width="120px"
            />
          </SearchSection>
        </Flex>
      ) : (
        <Flex justifyContent="end">
          {/* 공시사항 검색/필터 섹션 (검색창, 필터 옵션 등) */}
          <SearchSection keyword={keyword} placeholder="제목 입력">
            <FilterSelectBox
              statusFramework={noticeStatusFramework}
              selectedValue={category}
              queryKey="category"
              placeholder="카테고리"
              width="120px"
            />
          </SearchSection>
        </Flex>
      )}
      {noticeListError && (
        <ErrorAlert message="공지사항 목록을 불러오지 못했습니다. 다시 시도해주세요." />
      )}
      <CommonTable
        columnsWidth={
          <>
            <Table.Column htmlWidth="10%" />
            <Table.Column htmlWidth="10%" />
            <Table.Column htmlWidth="30%" />
            <Table.Column htmlWidth="10%" />
            {userRole === "ADMIN" ? (
              <>
                <Table.Column htmlWidth="10%" />
                <Table.Column htmlWidth="10%" />
                <Table.Column htmlWidth="10%" />
              </>
            ) : (
              <></>
            )}
          </>
        }
        headerTitle={
          <Table.Row
            backgroundColor={"#eee"}
            css={{
              "& > th": { textAlign: "center" },
            }}
          >
            <Table.ColumnHeader>우선순위</Table.ColumnHeader>
            <Table.ColumnHeader>카테고리</Table.ColumnHeader>
            <Table.ColumnHeader>제목</Table.ColumnHeader>
            <Table.ColumnHeader>등록일</Table.ColumnHeader>
            {userRole === "ADMIN" ? (
              <>
                <Table.ColumnHeader>수정일</Table.ColumnHeader>
                <Table.ColumnHeader>
                  <Flex justifyContent="center" alignItems="center">
                    <FilterSelectBox
                      statusFramework={noticeStatusOptions}
                      selectedValue={isDeleted}
                      queryKey="isDeleted"
                      placeholder="게시여부"
                      width="150px"
                    />
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader>관리</Table.ColumnHeader>
              </>
            ) : (
              <></>
            )}
          </Table.Row>
        }
        data={noticeList ?? []}
        loading={noticeListLoading}
        renderRow={(notice) => {
          const isEmergency = notice.priority === "EMERGENCY";
          return (
            <Table.Row
              key={notice.id}
              onClick={() => handleRowClick(notice.id)}
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
              <Table.Cell {...(isEmergency ? EMERGENCY_STYLE : {})}>
                {PRIORITY_LABELS[notice.priority]}
              </Table.Cell>
              <Table.Cell {...(isEmergency ? EMERGENCY_STYLE : {})}>
                {CATEGORY_LABELS[notice.category]}
              </Table.Cell>
              <Table.Cell {...(isEmergency ? EMERGENCY_STYLE : {})}>
                {notice.title}
              </Table.Cell>
              <Table.Cell {...(isEmergency ? EMERGENCY_STYLE : {})}>
                {formatDynamicDate(notice.regAt)}
              </Table.Cell>
              {userRole === "ADMIN" && (
                <>
                  <Table.Cell {...(isEmergency ? EMERGENCY_STYLE : {})}>
                    {formatDynamicDate(notice.updatedAt)}
                  </Table.Cell>
                  <Table.Cell {...(isEmergency ? EMERGENCY_STYLE : {})}>
                    {NOTICE_STATUS_LABELS[notice.isDeleted]}
                  </Table.Cell>
                  <Table.Cell onClick={(event) => event.stopPropagation()}>
                    <DropDownMenu
                      onEdit={() => handleEdit(notice.id)}
                      onDelete={() => handleDelete(notice.id)}
                    />
                  </Table.Cell>
                </>
              )}
            </Table.Row>
          );
        }}
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
