"use client";

import React from "react";
import { Box, Heading, Flex, Text, HStack, Stack } from "@chakra-ui/react";
import { Avatar } from "@/src/components/ui/avatar";
import Drawer from "./Drawer";
import Link from "next/link";
import User from "@/src/data/users_mock_data.json";

function Header() {
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="gray.500"
      color="white"
    >
      <Flex align="center" mr={5}>
        <Link href="/">
          <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
            BN SYSTEM
          </Heading>
        </Link>
      </Flex>

      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <svg
          fill="white"
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      {/* <Box display={{ base: show ? "block" : "none", md: "flex" }} width={{ base: "full", md: "auto" }} alignItems="center" flexGrow={1}>
        <MenuItems>Docs</MenuItems>
        <MenuItems>Examples</MenuItems>
        <MenuItems>Blog</MenuItems>
      </Box> */}
      <Drawer />

      <Box
        display={{ base: show ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        <Stack gap="8">
          {User.map((user) => (
            <HStack key={user.id} gap="4">
              <Avatar name={user.userName} size="lg" src={user.avatar} />
              <Stack gap="1" direction="row">
                <Text fontWeight="medium">{user.userName}</Text>
                <Text color="gray.300" textStyle="sm">
                  {user.orgName} ·
                </Text>
                <Text color="gray.300" textStyle="sm">
                  {user.jobRole}
                </Text>
              </Stack>
            </HStack>
          ))}
        </Stack>
      </Box>
    </Flex>
  );
}

export default Header;
