"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Box, Flex } from "@chakra-ui/react";
import Header from "@/src/components/layouts/Header";
import Sidebar from "@/src/components/layouts/Sidebar";
import { SidebarProvider } from "@/src/context/SidebarContext";
import { useUserInfo } from "@/src/hook/useFetchData";
import { layoutStyles } from "@/src/styles/layoutStyles";
import BackButton from "@/src/components/common/BackButton";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isSidebarOverlayPage = pathname !== "/";
  // 홈에서는 `true`, 그 외의 페이지에서는 `false`를 기본값으로 설정
  const [isSidebarOpen, setIsSidebarOpen] = useState(isHomePage);
  const [showOverlay, setShowOverlay] = useState(isSidebarOverlayPage);

  // 페이지 유형 구분 (목록 조회 vs 상세 조회)
  const isListPage =
    pathname === "/" ||
    pathname === "/admin/organizations" ||
    pathname === "/admin/members" ||
    pathname === "/notices";

  // 현재 로그인 한 사용자 정보
  const { data: loggedInUserInfo } = useUserInfo();
  const userRole = loggedInUserInfo?.role; // 기본값 설정

  // 반응형에서 사이드바 자동 조정
  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  // 페이지 이동 시, 사이드바 상태 변경
  useEffect(() => {
    setIsSidebarOpen(isHomePage);
    setShowOverlay(isSidebarOverlayPage);
  }, [pathname]);

  return (
    <SidebarProvider>
      <Flex direction="column" minHeight="100vh" position="relative">
        {/* 홈("/")이 아닌 경우에만 배경 오버레이 적용 */}
        {isSidebarOpen && showOverlay && (
          <Box {...layoutStyles.backgroundLayer(showOverlay)} />
        )}

        {/* 헤더 */}
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <Flex direction="row" flex={1} justify="center">
          {/* 사이드바 */}
          <Sidebar
            loggedInUserRole={userRole}
            isOpen={isSidebarOpen}
            isSidebarOverlayPage={isSidebarOverlayPage}
            onToggle={setIsSidebarOpen}
          />

          {/* 메인 콘텐츠 */}
          <Box
            as="main"
            {...layoutStyles.mainContent(isSidebarOpen, isListPage)}
            mb={"30rem"}
          >
            {!isListPage ? <BackButton /> : <></>}
            {children}
          </Box>
        </Flex>
      </Flex>
    </SidebarProvider>
  );
}
