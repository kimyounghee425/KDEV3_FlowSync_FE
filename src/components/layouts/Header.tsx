"use client";

import Link from "next/link";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import Profile from "@/src/components/layouts/Profile";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { layoutStyles } from "@/src/styles/layoutStyles";
interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({
  isSidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      {...layoutStyles.header}
    >
      {/* 왼쪽: 토글 버튼 및 공지사항 */}
      {/* <Flex align="center" gap="1rem" gapX={5}> */}
      <Flex align="center" gap="1rem">
        <IconButton
          aria-label="Toggle Sidebar"
          onClick={onToggleSidebar}
          variant="ghost"
          _hover={{ bg: "gray.100" }}
        >
          {isSidebarOpen ? (
            <PanelRightOpen size={24} color="#007bff" />
          ) : (
            <PanelRightClose size={24} />
          )}
        </IconButton>

        {/* 로고 */}
        <Link href="/">
          <Box display="flex" alignItems="center" gap={2}>
            <Image
              src="/logo.png" // public 디렉토리의 로고 파일 경로
              alt="FlowSync"
              height="25px" // 원하는 크기로 설정
              objectFit="contain"
            />
            <Text fontSize="1.2rem" fontWeight="bold">
              FlowSync
            </Text>
          </Box>
        </Link>
      </Flex>

      {/* 오른쪽: 프로필 */}
      <Profile />
    </Flex>
  );
}
