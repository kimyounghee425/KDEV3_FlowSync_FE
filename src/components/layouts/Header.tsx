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
      position="sticky"
      top="0"
      zIndex="10"
      height="60px" // 헤더 고정 높이
    >
      {/* 로고와 메뉴를 묶음 */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        height="60px" // 헤더 높이 고정
        px={4} // 좌우 여백
        bg="white"
      >
        {/* 로고 */}
        <Box
          display="flex" // Flexbox 사용
          alignItems="center" // 수직 중앙 정렬
          justifyContent="flex-start" // 로고가 왼쪽으로 정렬
          width={{ base: "100%", md: "300px" }} // 반응형 너비
          minWidth="250px" // 최소 너비를 250px로 설정
          maxWidth="300px" // 최대 너비를 300px로 설정
          height="100%" // Box 높이를 Flex 컨테이너와 동일하게 설정
        >
          <Link href="/">
            <Image
              src="https://bn-system.com/img/LOGO_SVG.svg"
              alt="BN SYSTEM"
              height="40px" // 고정 높이
              width="auto" // 자동 비율로 너비 조정
              objectFit="contain"
            />
          </Link>
        </Box>
        {/* 메뉴 */}
        <Flex
          as="ul"
          listStyleType="none"
          align="center"
          height="100%" // 메뉴 높이를 Flex 컨테이너와 동일하게 설정
        >
          <li>
            <Link
              href="/notices"
              style={{
                fontSize: "1.1rem",
                lineHeight: "60px", // 헤더 높이와 텍스트 높이 일치
              }}
            >
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
