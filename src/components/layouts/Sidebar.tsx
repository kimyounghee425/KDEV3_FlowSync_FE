"use client";

import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { SegmentedControl } from "@/src/components/ui/segmented-control";
import SidebarTab from "@/src/components/common/SidebarTab";
import User from "@/src/data/users_mock_data.json";
import Profile from "@/src/components/common/Profile";

function Sidebar() {
  const [projectStatus, setProjectStatus] = useState("진행중 프로젝트");

  return (
    <Flex flexDirection="column" gap="1" bg="gray.500">
      <Box width="100%" height="100vh" p={1}>
        {/* Avatar */}
        <Profile
          id={User.id}
          userName={User.userName}
          orgName={User.orgName}
          jobRole={User.jobRole}
          avatar={User.avatar}
          isSidebar={true}
        />

        {/* Segmented Control */}
        <SegmentedControl
          value={projectStatus}
          onValueChange={(e) => {
            setProjectStatus(e.value);
          }}
          items={["진행중 프로젝트", "완료 프로젝트"]}
        />
        {/* 프로젝트 목록 */}
        <SidebarTab projectStatus={projectStatus} />
        {/* 페이지 전환 버튼 */}
      </Box>
    </Flex>
  );
}

export default Sidebar;
