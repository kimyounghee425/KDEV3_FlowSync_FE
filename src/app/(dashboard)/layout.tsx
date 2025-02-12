"use client";

import { ReactNode, useEffect, useState } from "react";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import Header from "@/src/components/layouts/Header";
import Sidebar from "@/src/components/layouts/Sidebar";
import { SidebarProvider } from "@/src/context/SidebarContext";
import { useUserInfo } from "@/src/hook/useFetchData";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [colorMode, setColorMode] = useState("light");
  const [isLoaded, setIsLoaded] = useState(false);

  const sidebarWidth = useBreakpointValue({
    base: isSidebarOpen ? "70vw" : "0",
    md: isSidebarOpen ? "250px" : "0",
  });

  // 다크모드 색상 설정
  const bgColor = useColorModeValue("white", "gray.800"); // 전체 배경색
  const marginBgColor = useColorModeValue("white", "gray.900"); // 마진 영역 배경색

  // 현재 로그인 한 사용자 정보
  const { data: loggedInUserInfo } = useUserInfo();
  const userRole = loggedInUserInfo?.role; // 기본값 설정

  useEffect(() => {
    setIsLoaded(true); // 로딩 완료 상태
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("chakra-ui-color-mode");
    if (savedTheme) {
      setColorMode(savedTheme);
    }
    setIsLoaded(true);
  }, [setColorMode]);

  if (!isLoaded) return null;

  return (
    <SidebarProvider>
      <Flex
        direction="column"
        minHeight="100vh"
        bg={bgColor}
        transition="background-color 0.3s"
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <Flex
          direction="row"
          height="calc(100vh - var(--header-height))"
          bg={marginBgColor} // 마진 영역의 배경색 설정
        >
          {/* Sidebar 영역 */}
          <Box
            width={sidebarWidth} // 반응형 너비 적용
            minWidth="50px" // 사이드바 최소 크기 지정
            transition="width 0.3s ease-in-out"
            overflowY="auto"
            bg={bgColor}
          >
            <Sidebar
              loggedInUserRole={userRole}
              isOpen={isSidebarOpen}
              onToggle={setIsSidebarOpen}
            />
          </Box>

          {/* Main Content */}
          <Box
            flex={1}
            bg={marginBgColor} // 마진 영역의 배경색 설정
            // marginX={{ base: "0", md: isSidebarOpen ? "2%" : "10%" }} // 작은 화면에서는 마진 제거
            transition="margin 0.3s ease-in-out"
            padding={4}
          >
            <Flex
              as="main"
              flex="1"
              // flex={isSidebarOpen ? "82%" : "1"} // 나머지 공간 비율로 설정
              justify="center"
              align="flex-start"
              overflowY="auto"
              // padding={4}
              bg={bgColor}
            >
              <Box
                width="100%"
                maxWidth="var(--content-max-width)"
                bg={bgColor}
              >
                {children}
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </SidebarProvider>
  );
}
