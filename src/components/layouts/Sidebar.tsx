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
      flexDirection="column"
      gap="1"
      backgroundColor="gray.200"
      boxShadow="md"
    >
      <Box width="270px" height="100vh" p={1} marginTop="3">
        <CardRoot width="100%">
          {userRole === "ADMIN" ? (
            <>
              <Heading textAlign="center" borderRadius="4xl">
                관리자 전용 페이지
              </Heading>
              <SidebarTab memberRole="admin" />
            </>
          ) : (
            <>
              {/* Segmented Control */}
              <SegmentedControl
                value={selectedProjectFilter}
                onValueChange={(e) => {
                  setSelectedProjectFilter(e.value);
                }}
                items={["진행중 프로젝트", "완료 프로젝트"]}
              />
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
