"use client";

import { ReactNode } from "react";
import {
  Box,
  Container,
  Flex,
  IconButton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Header from "@/src/components/layouts/Header";
import Sidebar from "@/src/components/layouts/Sidebar";
import { SidebarProvider } from "@/src/context/SidebarContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // 반응형 레이아웃을 위한 사이드바 너비 조정
  const sidebarWidth = useBreakpointValue({
    base: "250px", // 모바일: 전체 화면
    md: "250px", // 태블릿 이상: 고정 너비
  });

  const contentPadding = useBreakpointValue({
    base: 4, // 모바일: 좁은 여백
    md: 10, // 태블릿 이상: 넓은 여백
  });
  return (
    <Flex direction="column" minHeight="100vh" bg="white">
      <Header />
      <Flex flex="1" overflow="hidden">
        {/* <Header /> */}
        <Container
          maxWidth={"100%"}
          display="flex"
          flexDirection="row"
          margin={0}
          padding={0}
          flexShrink={0} // 사이드바 크기 변경 방지
        >
          <SidebarProvider>
            <Sidebar />
          </SidebarProvider>
          {/* 메인 컨텐츠 */}
          <Flex
            as="main"
            flex="1"
            height="100%"
            align="flex-start"
            justify="center"
            overflow="hidden"
            bg="white"
          >
            <Box
              maxW="container.xl"
              width="100%"
              height="100%"
              p={contentPadding} // 반응형 패딩
            >
              {children}
            </Box>
          </Flex>
        </Container>
      </Flex>
    </Flex>
  );
}
