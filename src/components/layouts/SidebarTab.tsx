"use client";

import Link from "next/link";
import { Box, Flex } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/src/components/ui/menu";
import { ChevronDown } from "lucide-react";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import { useSidebar } from "@/src/context/SidebarContext";
import { useProjectInfiniteScroll } from "@/src/hook/useProjectInfiniteScroll";
import { Loading } from "@/src/components/common/Loading"; // 기존 컴포넌트 사용

interface SidebarTabProps {
  memberRole: "admin" | "member";
}

// 관리자 메뉴 항목
const ADMIN_MENU_ITEMS = [
  { value: "/", title: "프로젝트 관리" },
  { value: "/admin/organizations", title: "업체 관리" },
  { value: "/admin/members", title: "회원 관리" },
];

export default function SidebarTab({ memberRole }: SidebarTabProps) {
  const bgColor = useColorModeValue("white", "gray.900");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.700");

  const { selectedProjectFilter, setSelectedProjectFilter } = useSidebar();
  // 프로젝트 상태에 따른 데이터 가져오기
  const status =
    selectedProjectFilter === "완료 프로젝트" ? "COMPLETED" : "IN_PROGRESS";

  const { projectList, loading, hasMore, observerRef } =
    useProjectInfiniteScroll(memberRole === "member" ? status : "");

  return (
    <Box
      bg={bgColor}
      color={textColor}
      maxHeight="calc(100vh - 60px)"
      borderColor={borderColor}
    >
      {/* 관리자 메뉴 렌더링 */}
      {memberRole === "admin" ? (
        <Box mb={6} borderBottom="1px solid" borderColor={borderColor}>
          {ADMIN_MENU_ITEMS.map((item) => (
            <Link key={item.value} href={item.value}>
              <Box
                p={4}
                borderBottom="1px solid"
                borderColor={borderColor}
                _hover={{ bg: hoverBgColor }}
              >
                {item.title}
              </Box>
            </Link>
          ))}
        </Box>
      ) : (
        <>
          <MenuRoot positioning={{ placement: "right-end" }}>
            <MenuTrigger asChild>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={4}
                border="1px solid"
                borderColor={borderColor}
                cursor="pointer"
              >
                <Box>
                  {selectedProjectFilter === "진행중 프로젝트"
                    ? "진행중 프로젝트"
                    : "완료 프로젝트"}
                </Box>
                {/* ChevronDown 아이콘 */}
                <ChevronDown />
              </Box>
            </MenuTrigger>
            <MenuContent bg={bgColor} borderColor={borderColor} zIndex="10">
              <MenuItem
                value="진행중 프로젝트"
                onClick={() => setSelectedProjectFilter("진행중 프로젝트")}
                bg={
                  selectedProjectFilter === "진행중 프로젝트"
                    ? hoverBgColor
                    : "transparent"
                }
                _hover={{ bg: hoverBgColor }}
                fontWeight={
                  selectedProjectFilter === "진행중 프로젝트"
                    ? "bold"
                    : "normal"
                }
              >
                진행중 프로젝트
              </MenuItem>
              <MenuItem
                value="완료 프로젝트"
                onClick={() => setSelectedProjectFilter("완료 프로젝트")}
                bg={
                  selectedProjectFilter === "완료 프로젝트"
                    ? hoverBgColor
                    : "transparent"
                }
                _hover={{ bg: hoverBgColor }}
                fontWeight={
                  selectedProjectFilter === "진행중 프로젝트"
                    ? "bold"
                    : "normal"
                }
              >
                완료 프로젝트
              </MenuItem>
            </MenuContent>
          </MenuRoot>

          <Flex flexDirection="column" justifyContent="center">
            {projectList.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}/tasks`}
                passHref
              >
                <Box
                  p={4}
                  textAlign="center"
                  borderBottom="1px solid"
                  borderColor={borderColor}
                  _hover={{ bg: hoverBgColor }}
                  overflowX="hidden" // 넘치는 텍스트 숨김
                  whiteSpace="nowrap" // 텍스트를 한 줄로 유지
                  textOverflow="ellipsis" // 말줄임표 처리
                  maxWidth="250px"
                >
                  {project.name}
                </Box>
              </Link>
            ))}
            {/* 로딩 상태 표시 */}
            {loading && hasMore && (
              <Box mt={4} display="flex" justifyContent="center">
                <Loading />
              </Box>
            )}
          </Flex>

          {/* 무한 스크롤 감지 */}
          {hasMore && <div ref={observerRef} style={{ height: "10px" }} />}
        </>
      )}
    </Box>
  );
}
