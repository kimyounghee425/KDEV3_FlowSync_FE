"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Box, CardRoot, Flex, Heading, VStack } from "@chakra-ui/react";
import { SegmentedControl } from "@/src/components/ui/segmented-control";
import SidebarTab from "@/src/components/layouts/SidebarTab";
import { useSidebar } from "@/src/context/SidebarContext";

export default function Sidebar() {
  const { projectStatus, setProjectStatus } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname(); // 현재 URL 경로 가져오기
  const isAdminPage = pathname.includes("/admin"); // URL에 admin이 포함되는지 확인

  // 사이드바 탭 (진행중 프로젝트, 완료 프로젝트)
  useEffect(() => {
    // 프로젝트 상태 변경 시 로딩 시뮬레이션
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false); // 로딩 완료
    }, 300); // 로딩 시간 설정 (예: 500ms)
    return () => clearTimeout(timeout); // 클린업
  }, [projectStatus]);

  return (
    <Flex flexDirection="column" gap="1" backgroundColor="gray.200" boxShadow="md">
      <Box width="270px" height="100vh" p={1} marginTop="3">
        <CardRoot width="100%">
          {isAdminPage ? (
            <>
              <Heading textAlign="center" borderRadius="4xl">
                관리자 전용 페이지
              </Heading>
              <SidebarTab memberRole="admin" />
            </>
          ) : (
            <>
              {/* Segmented Control */}
              <SegmentedControl
                value={projectStatus}
                onValueChange={e => {
                  setProjectStatus(e.value);
                }}
                items={["진행중 프로젝트", "완료 프로젝트"]}
              />
              {/* 프로젝트 목록 */}
              <SidebarTab memberRole="member" />
              {/* 페이지 전환 버튼 */}
            </>
          )}
        </CardRoot>
      </Box>
    </Flex>
  );
}
