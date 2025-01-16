"use client";

import React, { useEffect, useState } from "react";
import { Heading, Flex } from "@chakra-ui/react";
import Drawer from "./Drawer";
import Link from "next/link";
import membersData from "@/src/data/members_mock_data.json";
import orgsData from "@/src/data/organizations_mock_data.json";
import Profile from "@/src/components/common/Profile";
import { ProfileProps } from "@/src/types/profile";

function Header() {
  const [user, setUser] = useState<ProfileProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  // 사용자 Role 정보 가져오기 (관리자 계정 여부 체크)
  useEffect(() => {
    const getUserData = async () => {
      try {
        // 로컬스토리지에서 'user' 값을 가져오기
        const userData = localStorage.getItem("user");
        if (!userData) {
          throw new Error("User 정보가 로컬스토리지에 없습니다.");
        }
        const userObject = JSON.parse(userData);
        setUser({
          id: userObject.id,
          userName: userObject.name,
          orgId: userObject.org_id,
          jobRole: userObject.job_role,
          profile_image_url: userObject.profile_image_url, // 기본값 제공
        });
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setError(null); // 에러 메시지 초기화
      }
    };
    getUserData();
  }, []);

  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1rem" backgroundColor="gray.200" boxShadow="md">
      <Flex align="center" mr={5}>
        <Link href="/">
          <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
            BN SYSTEM
          </Heading>
        </Link>
      </Flex>

      <Drawer />

      {/* Avatar */}
      <Profile id={user?.id} userName={user?.userName} orgName={user?.orgName} jobRole={user?.jobRole} profile_image_url={user?.profile_image_url} />
    </Flex>
  );
}

export default Header;
