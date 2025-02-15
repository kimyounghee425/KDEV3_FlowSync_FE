"use client";

import { ReactNode, useEffect, useState } from "react";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import Header from "@/src/components/layouts/Header";
import Sidebar from "@/src/components/layouts/Sidebar";
import { SidebarProvider } from "@/src/context/SidebarContext";
import { useUserInfo } from "@/src/hook/useFetchData";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const sidebarWidth = useBreakpointValue({
    base: isSidebarOpen ? "70vw" : "0",
    md: isSidebarOpen ? "10vw" : "0",
  });

  // 현재 로그인 한 사용자 정보
  const { data: loggedInUserInfo } = useUserInfo();
  const userRole = loggedInUserInfo?.role; // 기본값 설정

  useEffect(() => {
    setIsLoaded(true); // 로딩 완료 상태
  }, []);

  if (!isLoaded) return null;

  return (
    <SidebarProvider>
      <Flex
        direction="column"
        minHeight="100vh"
        bg="white"
        transition="background-color 0.3s"
      >
        {/* Header */}
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* 메인 레이아웃 */}
        <Flex direction="row" height="calc(100vh - var(--header-height))">
          {/* Sidebar 영역 */}

          <Sidebar
            loggedInUserRole={userRole}
            isOpen={isSidebarOpen}
            onToggle={setIsSidebarOpen}
          />

          {/* Main Content */}
          <Box
            flex="1"
            marginLeft={sidebarWidth}
            transition="margin-left 0.3s ease-in-out"
            p="2.5rem"
            height="100%"
          >
            {children}
          </Box>
        </Flex>
      </Flex>
    </SidebarProvider>
  );
}
