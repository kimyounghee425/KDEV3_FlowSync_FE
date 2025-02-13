"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flex, Text, Box } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/src/components/ui/menu";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import { Avatar } from "@/src/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { Loading } from "@/src/components/common/Loading";
import axiosInstance from "@/src/api/axiosInstance";
import { getRandomProfileImage } from "@/src/utils/getRandomProfileImage";

interface UserProfileData {
  name: string;
  organizationName: string;
  role: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("#ebf2fa", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  useEffect(() => {
    // 사용자 정보 가져오기
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/me");
        if (response.data.code === 200 && response.data.result === "SUCCESS") {
          setUserData({
            name: response.data.data.name,
            organizationName: response.data.data.organizationName,
            role: response.data.data.role,
          });
          // #TODO 랜덤 프로필 이미지 설정 -> 회사 로고 등 이미지 변경
          // 프로필 이미지를 외부 URL에서 가져올 때, URL 뒤에 캐싱 방지 쿼리 문자열(timestamp) 를 추가하여 브라우저 캐시 무력화
          setProfileImageUrl(
            `${getRandomProfileImage()}?timestamp=${Date.now()}`,
          );
        }
      } catch (error) {
        console.error("사용자 데이터를 가져오지 못했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/logout");
      if (response.data.code === 200 && response.data.result === "SUCCESS") {
        // 브라우저의 쿠키 삭제 (액세스 토큰, 리프레시 토큰)
        const clearCookies = () => {
          const cookies = document.cookie.split("; ");
          cookies.forEach((cookie) => {
            const [key] = cookie.split("=");
            document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
          });
        };
        clearCookies();
        // 로컬 스토리지 초기화
        localStorage.removeItem("user");
        localStorage.removeItem("projectStatus");
        alert("로그아웃 되었습니다.");
        // 강제로 새로고침하면서 로그인 페이지로 이동
        // route.push() 의 경우, 브라우저 캐싱 때문에 로그인 페이지로 이동해도 기존 쿠키 값이 보여짐
        window.location.href = "/login";
      } else {
        throw new Error(response.data.message || "로그아웃에 실패하였습니다.");
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패하였습니다. 다시 시도해주세요.");
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" width="100%" height="100%">
        <Loading />
      </Flex>
    );
  }

  if (!userData) {
    return (
      <Text color={subTextColor} fontSize="sm">
        사용자 정보를 불러올 수 없습니다.
      </Text>
    );
  }

  return (
    <MenuRoot positioning={{ placement: "right-end" }}>
      <MenuTrigger asChild>
        <Box
          display="Flex"
          alignItems="center"
          gap={3}
          paddingX="1rem"
          backgroundColor={bgColor}
          _hover={{ backgroundColor: hoverBgColor }}
          borderRadius="md"
          cursor="pointer" // 프로필 전체를 클릭 가능하도록 설정
          position="relative" // 부모 박스를 기준으로 위치 설정
        >
          {/* Avatar와 사용자 정보 */}
          <Avatar size="sm" src={profileImageUrl || ""} name={userData.name} />
          <Flex direction="row" align="center" gap={3}>
            <Box>
              <Text
                fontWeight="bold"
                fontSize="md"
                color={textColor}
                lineHeight="1"
              >
                {userData.name}
              </Text>
              <Text fontSize="sm" color={subTextColor}>
                {userData.organizationName} · {userData.role}
              </Text>
            </Box>
            {/* ChevronDown 아이콘 */}
            <Box as={ChevronDown} color={textColor} />
          </Flex>
        </Box>
      </MenuTrigger>
      <MenuContent
        style={{
          position: "absolute",
          right: "0", // ChevronDown 부분에 맞춰 위치
          top: "100%", // 아래로 펼쳐지도록 설정
          marginTop: "0.5rem", // 약간의 간격 추가
          zIndex: 10, // 다른 UI 요소 위에 표시
        }}
      >
        {/* 드롭다운 메뉴 */}
        <MenuItem
          asChild
          value="로그아웃"
          color="fg.error"
          _hover={{ bg: "bg.error", color: "fg.error" }}
          onClick={handleLogout}
        >
          <Link href={"/"}>로그아웃</Link>
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
