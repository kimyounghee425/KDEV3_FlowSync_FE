"use client";

import { Box, Card, CardRoot, Flex, Heading } from "@chakra-ui/react";
import { SegmentedControl } from "@/src/components/ui/segmented-control";
import SidebarTab from "@/src/components/common/SidebarTab";
import { useSidebar } from "@/src/context/SidebarContext";
import { useEffect, useState } from "react";
import User from "@/src/data/members_mock_data.json";

const ADMIN_USER_ID = User.data[0].id; // 관리자 계정 ID (value: 숫자 0)
async function isAdminCheck() {
  // 관리자 계정이면 true 반환, 일반 user 이면 false 반환
  try {
    // 로컬스토리지에서 'user' 값을 가져오기
    const userData = localStorage.getItem("user");
    if (!userData) {
      throw new Error("User 정보가 로컬스토리지에 없습니다.");
    }
    // JSON 문자열을 객체로 변환
    const userObject = JSON.parse(userData);
    return userObject.id === ADMIN_USER_ID; // true: admin 계정, false: 일반 user 계정
  } catch (err: any) {
    console.log(err.message || "An unknown error occurred");
    return false; // 기본적으로 관리자 아님
  }
}

export default function Sidebar() {
  const { projectStatus, setProjectStatus } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 사용자 Role 정보 확인 (관리자 계정 여부 체크)
  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = await isAdminCheck();
      setIsAdmin(adminStatus);
    };
    checkAdminStatus();
  }, []);

  // 사이드바 "프로젝트 진행 중 vs 완료" 탭
  useEffect(() => {
    // 프로젝트 상태 변경 시 로딩 시뮬레이션
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false); // 로딩 완료
    }, 300); // 로딩 시간 설정 (예: 500ms)
    return () => clearTimeout(timeout); // 클린업
  }, [projectStatus]);

  return (
    <Flex
      flexDirection="column"
      gap="1"
      backgroundColor="gray.200"
      boxShadow="md">
      <Box width="270px" height="100vh" p={1} marginTop="3">
        <CardRoot width="100%">
          {isAdmin ? (
            <>
              <Box width="100%" p="0">
                <Heading textAlign="center" borderRadius="4xl">
                  관리자 전용 페이지
                </Heading>
              </Box>
              <SidebarTab memberRole="admin" />
            </>
          ) : (
            <>
              {/* Segmented Control */}
              <SegmentedControl
                value={projectStatus}
                onValueChange={(e) => {
                  setProjectStatus(e.value);
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
