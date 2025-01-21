"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heading, Flex } from "@chakra-ui/react";
import Drawer from "@/src/components/layouts/Drawer";
import Profile, { ProfileProps } from "@/src/components/layouts/Profile";

export default function Header() {
  const [user, setUser] = useState<ProfileProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  // 사용자 Role 정보 가져오기 (관리자 계정 여부 체크)
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) throw new Error("User 정보가 로컬스토리지에 없습니다.");

        const userObject = JSON.parse(userData);
        if (typeof userObject.id === "number" && typeof userObject.name === "string" && typeof userObject.org_name === "string" && typeof userObject.job_role === "string" && typeof userObject.profile_image_url === "string") {
          setUser({
            id: userObject.id,
            userName: userObject.name,
            orgName: userObject.org_name,
            jobRole: userObject.job_role,
            profile_image_url: userObject.profile_image_url,
          });
        } else {
          throw new Error("User 데이터 형식이 올바르지 않습니다.");
        }
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
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
      {user && <Profile id={user.id} userName={user.userName} orgName={user.orgName} jobRole={user.jobRole} profile_image_url={user.profile_image_url} />}{" "}
    </Flex>
  );
}
