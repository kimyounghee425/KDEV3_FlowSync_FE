"use client";

import Link from "next/link";
import { FiSun, FiMoon } from "react-icons/fi";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import {
  useColorMode,
  useColorModeValue,
} from "@/src/components/ui/color-mode";
import Profile from "@/src/components/layouts/Profile";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({
  isSidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  const { toggleColorMode, colorMode } = useColorMode();
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Flex
      as="header"
      height="var(--header-height)"
      align="center"
      justify="space-between"
      paddingX="1rem"
      backgroundColor={colorMode === "dark" ? "gray.800" : "white"}
      color={textColor}
      position="sticky"
      top="0"
      zIndex={10}
      boxShadow="md"
      transition="none" // transition 제거
    >
      {/* 왼쪽: 토글 버튼 및 공지사항 */}
      <Flex align="center" gap="1rem" gapX={5}>
        <IconButton
          aria-label="Toggle Sidebar"
          onClick={onToggleSidebar}
          variant="ghost"
          _hover={{ bg: "gray.100" }}
        >
          {isSidebarOpen ? <PanelRightOpen /> : <PanelRightClose />}
        </IconButton>
        <Link href="/">
          <Box
            // position="absolute"
            // left="50%"
            // transform="translateX(-50%)"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Image
              src="/logo.png" // public 디렉토리의 로고 파일 경로
              alt="FlowSync"
              height="25px" // 원하는 크기로 설정
              objectFit="contain"
            />
            <Text fontSize="1.2rem">FlowSync</Text>
          </Box>
        </Link>
      </Flex>

      {/* 오른쪽: 다크모드 및 프로필 */}
      <Flex align="center" gap="1rem">
        <IconButton
          aria-label="Toggle Dark Mode"
          onClick={toggleColorMode}
          variant="ghost"
        >
          {colorMode === "dark" ? <FiSun /> : <FiMoon />}
        </IconButton>
        <Profile />
      </Flex>
    </Flex>
  );
}
