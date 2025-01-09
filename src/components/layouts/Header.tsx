"use client";

import React from "react";
import { Heading, Flex } from "@chakra-ui/react";
import Drawer from "./Drawer";
import Link from "next/link";
import User from "@/src/data/users_mock_data.json";
import Profile from "@/src/components/common/Profile";

function Header() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      backgroundColor="gray.200"
      boxShadow="md"
    >
      <Flex align="center" mr={5}>
        <Link href="/">
          <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
            BN SYSTEM
          </Heading>
        </Link>
      </Flex>

      <Drawer />

      {/* Avatar */}
      <Profile
        id={User.id}
        userName={User.userName}
        orgName={User.orgName}
        jobRole={User.jobRole}
        avatar={User.avatar}
        isSidebar={false}
      />
    </Flex>
  );
}

export default Header;
