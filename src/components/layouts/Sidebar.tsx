"use client";

import { useEffect } from "react";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import SidebarTab from "@/src/components/layouts/SidebarTab";

interface SidebarProps {
  loggedInUserRole: string | undefined;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void; // 사이드바 토글 함수 추가
}

export default function Sidebar({
  loggedInUserRole,
  isOpen,
  onToggle,
}: SidebarProps) {
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  // 반응형 사이드바 너비 설정
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (isMobile) {
      onToggle(false); // 작은 화면에서는 자동으로 접음
    }
  }, [isMobile, onToggle]);

  // ✅ 반응형 사이드바 너비 설정
  const sidebarWidth = useBreakpointValue({ base: "clamp(150px, 70vw, 200px)", md: "250px" }); // ..

  if (!loggedInUserRole) {
    return (
      <Box textAlign="center" mt="4" color="gray.500" fontSize="1rem">
        사용자 정보를 불러오는 중입니다.
      </Box>
    );
  }

  return (
    <Flex
      as="aside"
      flexDirection="column"
      position="fixed"
      top="var(--header-height)"
      left="0"
      width={isOpen ? sidebarWidth : "0px"}
      minWidth="0px"
      height="calc(100vh - var(--header-height))"
      bg={bgColor}
      borderRight={isOpen ? "1px solid" : "none"}
      borderColor={borderColor}
      transition="width 0.3s ease-in-out"
      zIndex="100"
      overflowY="auto" // ✅ 내부 콘텐츠가 많을 경우 스크롤 가능하도록 변경
      css={{
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          background: hoverBgColor,
          borderRadius: "4px",
        },
      }}
    >
      <Box padding="1rem" maxWidth="100%">
        <SidebarTab
          memberRole={loggedInUserRole === "ADMIN" ? "admin" : "member"}
        />
      </Box>
    </Flex>
  );
}
