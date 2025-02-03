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
          // 랜덤 프로필 이미지 설정
          setProfileImageUrl(getRandomProfileImage());
        }
      } catch (error: any) {
        console.error("사용자 데이터를 가져오지 못했습니다.", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <Loading />;
  }

  return (
    <Box
      display="Flex"
      alignItems="center"
      gap={3}
      paddingX="1rem"
      backgroundColor="white" // 배경색
      _hover={{ backgroundColor: "#ebf2faef" }} // 호버 효과
      borderRadius="md"
    >
      {/* Avatar와 사용자 정보 */}
      <Avatar size="sm" src={profileImageUrl || ""} name={userData.name} />
      <Flex direction="row" align="flex-start" gap={3}>
        <Text fontWeight="bold" fontSize="md" color="black">
          {userData.name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {userData.organizationName} · {userData.role}
        </Text>
        <MenuRoot>
          <MenuTrigger asChild>
            <ChevronDown cursor="pointer" />
          </MenuTrigger>
          <MenuContent>
            {/* 드롭다운 메뉴 */}
            <MenuItem asChild value="마이페이지">
              <Link href={"/"}>마이페이지</Link>
            </MenuItem>
            <MenuItem
              asChild
              value="로그아웃"
              color="fg.error"
              _hover={{ bg: "bg.error", color: "fg.error" }}
            >
              <Link href={"/"}>로그아웃</Link>
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </Flex>
    </Box>
  );
}
