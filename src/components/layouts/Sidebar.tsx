"use client";

import { Box, CardRoot, Flex, Heading } from "@chakra-ui/react";
import { SegmentedControl } from "@/src/components/ui/segmented-control";
import SidebarTab from "@/src/components/layouts/SidebarTab";
import { useSidebar } from "@/src/context/SidebarContext";
import { fetchUserInfo as fetchUserInfoApi } from "@/src/api/auth";
import { useFetchData } from "@/src/hook/useFetchData";
import { UserInfoResponse } from "@/src/types";
import { Loading } from "../common/Loading";

export default function Sidebar() {
  const { selectedProjectFilter, setSelectedProjectFilter } = useSidebar();
  const { data: userInfoData, loading: userInfoLoading } = useFetchData<
    UserInfoResponse,
    []
  >({
    fetchApi: fetchUserInfoApi,
    params: [],
  });

  const userRole = userInfoData?.role;

  if (userInfoLoading) {
    return <Loading />;
  }

  return (
    <Flex
      as="aside"
      flexDirection="column"
      backgroundColor="white"
      width={{ base: "100%", md: "250px" }} // 반응형 너비
      minWidth="200px" // 최소 너비를 250px로 설정
      maxWidth="250px" // 최대 너비를 300px로 설정
      boxShadow="md"
      height="100%" // 헤더 높이를 제외한 나머지 화면 높이
      overflowY="hidden"
      borderRight="1px solid" // 오른쪽 구분선 추가
      borderColor="gray.300" // 구분선 색상 설정
    >
      <Box
        bg="white"
        height="calc(100vh - 60px)"
        width="100%" // 부모 컨테이너의 너비를 100%로 설정
      >
        <CardRoot
          backgroundColor="transparent" // CardRoot 배경 투명 처리
          boxShadow="none" // 박스 그림자 제거
          border="none"
        >
          {userRole === "ADMIN" ? (
            <>
              <Flex
                justifyContent="center" // 가로 중앙 정렬
                alignItems="center" // 세로 중앙 정렬
                height="60px" // 고정 높이
                backgroundColor="transparent" // 배경 투명 처리
                borderBottom="1px solid" // 하단 경계선만 유지
                borderColor="gray.200"
              >
                <Heading textAlign="center" size="md">
                  관리자 전용 페이지
                </Heading>
              </Flex>
              <SidebarTab memberRole="admin" />
            </>
          ) : (
            <>
              <Box mb={4} paddingTop={4}>
                {/* Segmented Control */}
                <SegmentedControl
                  value={selectedProjectFilter}
                  onValueChange={(e) => {
                    setSelectedProjectFilter(e.value);
                  }}
                  items={["진행중 프로젝트", "완료 프로젝트"]}
                />
              </Box>
              {/* 프로젝트 목록 */}
              <SidebarTab memberRole="member" />
              {/* 페이지 전환 버튼 */}
            </>
          )}
        </CardRoot>
      </Box>
    </Flex>
  );
}
