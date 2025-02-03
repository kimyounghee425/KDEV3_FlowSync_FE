import React from "react";
import Link from "next/link";
import { Box, Flex, Image, Spacer } from "@chakra-ui/react";
import Profile from "@/src/components/layouts/Profile";

export default function Header() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="nowrap" // 콘텐츠 줄바꿈 방지
      padding="1rem"
      backgroundColor="white"
      boxShadow="md"
      position="relative"
      zIndex="10"
      height="70px" // 헤더 고정 높이
    >
      {/* 로고와 메뉴를 묶음 */}
      <Flex align="center" gap="24">
        {/* 로고 */}
        <Box>
          <Link href="/">
            <Image
              src="https://bn-system.com/img/LOGO_SVG.svg"
              alt="BN SYSTEM"
              height={{ base: "40px", md: "50px" }} // 반응형 크기 조정
              objectFit="contain"
            />
          </Link>
        </Box>

        {/* 메뉴 */}
        <Flex as="ul" listStyleType="none" align="center">
          <li>
            <Link href="/notices" style={{ fontSize: "1.1rem" }}>
              공지사항
            </Link>
          </li>
        </Flex>
      </Flex>

      {/* Spacer를 사용해 프로필을 오른쪽으로 배치 */}
      <Spacer />

      {/* 프로필 */}
      <Box>
        <Profile />
      </Box>
    </Flex>
  );
}
