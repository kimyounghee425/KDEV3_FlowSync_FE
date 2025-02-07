"use client";

import { Box, Flex } from "@chakra-ui/react";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import SidebarTab from "@/src/components/layouts/SidebarTab";
import { useUserInfo } from "@/src/hook/useFetchData";
import { Loading } from "@/src/components/common/Loading";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  // const textColor = useColorModeValue("gray.800", "white");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  const { data: userInfoData, loading: userInfoLoading } = useUserInfo();

  const userRole = userInfoData?.role;

  if (userInfoLoading) {
    return <Loading />;
  }

  if (!userRole) {
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
      position="relative" /* fixed 대신 relative 사용 */
      left={isOpen ? "0" : "-100%"} // 모바일에서 사이드바 열고 닫기
      height="calc(100vh - var(--header-height))"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      transition="width 0.3s ease-in-out"
      zIndex="10"
      overflowY="auto"
      css={{
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-thumb": {
          background: hoverBgColor,
          borderRadius: "4px",
        },
      }}
    >
      <Box padding="1rem">
        <SidebarTab memberRole={userRole === "ADMIN" ? "admin" : "member"} />
      </Box>
    </Flex>
  );
}
