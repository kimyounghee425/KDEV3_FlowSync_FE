"use client";

import { Box, Flex } from "@chakra-ui/react";
import { SegmentedControl } from "@/src/components/ui/segmented-control";
import SidebarTab from "@/src/components/common/SidebarTab";
import User from "@/src/data/users_mock_data.json";
import Profile from "@/src/components/common/Profile";
import { useSidebar } from "@/src/context/SidebarContext";
import { useEffect, useState } from "react";
import { Loading } from "../common/Loading";

function Sidebar() {
  const { projectStatus, setProjectStatus } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 프로젝트 상태 변경 시 로딩 시뮬레이션
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false); // 로딩 완료
    }, 300); // 로딩 시간 설정 (예: 500ms)
    return () => clearTimeout(timeout); // 클린업
  }, [projectStatus]);

  return (
    <Flex
      flexDirection="column"
      gap="1"
      backgroundColor="gray.200"
      boxShadow="md"
    >
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
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {/* Segmented Control */}
            <SegmentedControl
              value={projectStatus}
              onValueChange={(e) => {
                setProjectStatus(e.value);
              }}
              items={["진행중 프로젝트", "완료 프로젝트"]}
            />
            {/* 프로젝트 목록 */}
            <SidebarTab />
            {/* 페이지 전환 버튼 */}
          </>
        )}
      </Box>
    </Flex>
  );
}

export default Sidebar;
