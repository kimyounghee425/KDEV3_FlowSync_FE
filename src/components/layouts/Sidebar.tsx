"use client";

import React, { useState } from "react";
import { Box, Flex, Text, HStack, Stack } from "@chakra-ui/react";
import { Avatar } from "@/src/components/ui/avatar";
import { SegmentedControl } from "@/src/components/ui/segmented-control";
import SidebarTab from "@/src/components/common/SidebarTab";
import User from "@/src/data/users_mock_data.json";

function Sidebar() {
  const [value, setValue] = useState("진행중 프로젝트");

  return (
    <Flex flexDirection="column" gap="1" bg="gray.500">
      <Box width="100%" height="100vh" p={1}>
        {/* Avatar */}
        <Box width="100%">
          <Stack gap="8">
            {User.map((user) => (
              <HStack key={user.id} gap="4">
                <Avatar name={user.userName} size="lg" src={user.avatar} />
                <Stack gap="0">
                  <Text color="white" fontWeight="medium">
                    {user.userName}
                  </Text>
                  <Text color="gray.300" textStyle="sm">
                    {user.orgName} · {user.jobRole}
                  </Text>
                </Stack>
              </HStack>
            ))}
          </Stack>
        </Box>
        {/* Segmented Control */}
        <SegmentedControl
          value={value}
          onValueChange={(e) => {
            setValue(e.value);
          }}
          items={["진행중 프로젝트", "완료 프로젝트"]}
        />
        {/* 프로젝트 목록 */}
        <SidebarTab props={value} />
        {/* 페이지 전환 버튼 */}
      </Box>
    </Flex>
  );
}

export default Sidebar;
