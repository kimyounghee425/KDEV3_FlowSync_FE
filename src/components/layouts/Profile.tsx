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

  // 로그인 사용자 데이터 페칭
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/me");
        if (response.data.code === 200 && response.data.result === "SUCCESS") {
          setUserData({
            name: response.data.data.name,
            organizationName: response.data.data.organizationName,
            role: response.data.data.role,
          });
        }
      } catch (error) {
        // 사용자 데이터를 가져오지 못했습니다.
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Hydration 문제 해결: useEffect에서 프로필 이미지 설정
  useEffect(() => {
    if (userData) {
      setProfileImageUrl(getRandomProfileImage());
    }
  }, [userData]);

  // 로그아웃 API 호출
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
        // 강제로 새로고침하면서 로그인 페이지로 이동
        // route.push() 의 경우, 브라우저 캐싱 때문에 로그인 페이지로 이동해도 기존 쿠키 값이 보여짐
        window.location.href = "/login";
      }
    } catch (error) {}
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" width="100%" height="100%">
        <Loading />
      </Flex>
    );
  }

  if (!userData) {
    return <Text fontSize="sm">사용자 정보를 불러올 수 없습니다.</Text>;
  }

  return (
    <MenuRoot positioning={{ placement: "bottom-end" }}>
      <MenuTrigger asChild>
        <Box
          display="Flex"
          alignItems="center"
          gap={3}
          paddingX="1rem"
          borderRadius="md"
          cursor="pointer" // 프로필 전체를 클릭 가능하도록 설정
          position="relative" // 부모 박스를 기준으로 위치 설정
          zIndex="101"
          transition="background-color 0.3s ease-in-out"
          _hover={{ bg: "gray.200" }}
        >
          {/* Avatar와 사용자 정보 */}
          <Avatar
            size="sm"
            src={profileImageUrl || undefined}
            name={userData.name}
          />
          <Flex direction="row" align="center" gap={3}>
            <Box>
              <Text fontWeight="bold" fontSize="md" lineHeight="1">
                {userData.name}
              </Text>
              <Text fontSize="sm">
                {userData.organizationName} · {userData.role}
              </Text>
            </Box>
            {/* ChevronDown 아이콘 */}
            <Box as={ChevronDown} />
          </Flex>
        </Box>
      </MenuTrigger>
      <MenuContent
        style={{
          width: "150px",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          zIndex: 200,
        }}
      >
        {/* 드롭다운 메뉴 */}
        <MenuItem
          asChild
          value="logout"
          _hover={{ bg: "#7dbcffde", color: "white" }}
          onClick={handleLogout}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link href={"/"}>로그아웃</Link>
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
