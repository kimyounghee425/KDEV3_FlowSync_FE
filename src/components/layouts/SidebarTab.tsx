"use client";

import Link from "next/link";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/src/components/ui/menu";
import {
  ChevronDown,
  Home,
  Briefcase,
  Building,
  Users,
  Bell,
} from "lucide-react";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import { useSidebar } from "@/src/context/SidebarContext";
import { useProjectInfiniteScroll } from "@/src/hook/useProjectInfiniteScroll";
import { Loading } from "@/src/components/common/Loading"; // 기존 컴포넌트 사용

interface SidebarTabProps {
  memberRole: "admin" | "member";
}

// 관리자 메뉴 항목
const ADMIN_MENU_ITEMS = [
  { value: "/", title: "프로젝트 관리", icon: Briefcase },
  { value: "/admin/organizations", title: "업체 관리", icon: Building },
  { value: "/admin/members", title: "회원 관리", icon: Users },
  { value: "/notices", title: "공지사항 관리", icon: Bell },
];

export default function SidebarTab({ memberRole }: SidebarTabProps) {
  const bgColor = useColorModeValue("white", "gray.900");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.700");

  const { selectedProjectFilter, setSelectedProjectFilter } = useSidebar();

  const managementStep = (() => {
    switch (selectedProjectFilter) {
      case "계약":
        return "CONTRACT";
      case "진행중":
        return "IN_PROGRESS";
      case "납품완료":
        return "COMPLETED";
      default:
        return "";
    }
  })();

  // 프로젝트 상태에 따른 데이터 가져오기
  const { projectList, loading, hasMore, observerRef } =
    useProjectInfiniteScroll(memberRole === "member" ? managementStep : "");

  // 반응형 크기 설정
  const menuWidth = useBreakpointValue({ base: "100%", sm: "250px" }); // 작은 화면에서는 전체 너비, 큰 화면에서는 250px

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
                display="flex"
                alignItems="center"
                gap={3}
                borderBottom="1px solid"
                borderColor={borderColor}
                _hover={{ bg: hoverBgColor }}
              >
                {item.icon && <item.icon size={20} />}{" "}
                {/* 선택적으로 아이콘 삽입 */}
                {item.title}
              </Box>
            </Link>
          ))}
        </Box>
      ) : (
        <>
          <MenuRoot positioning={{ placement: "bottom-start" }}>
            <MenuTrigger asChild>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={3}
                py={2}
                width="100%" // 부모 크기에 맞춤
                maxWidth="200px" // 최대 크기 제한
                minWidth="80px" // 최소 크기 설정 (너무 커지지 않게)
                border="1px solid"
                borderColor={borderColor}
                cursor="pointer"
                borderRadius="md"
              >
                <Box
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {selectedProjectFilter || "프로젝트 필터"}
                </Box>
                {/* ChevronDown 아이콘 */}
                <ChevronDown />
              </Box>
            </MenuTrigger>
            <MenuContent
              bg={bgColor}
              borderColor={borderColor}
              zIndex="200"
              height="auto"
              maxHeight="200px" // 최대 높이 설정
              overflowY="scroll" // 내부 스크롤 활성화
              css={{
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "gray.400",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "gray.500",
                },
              }}
            >
              <MenuItem
                value="계약"
                onClick={() => setSelectedProjectFilter("계약")}
                bg={
                  selectedProjectFilter === "계약"
                    ? hoverBgColor
                    : "transparent"
                }
                _hover={{ bg: hoverBgColor }}
                fontWeight={
                  selectedProjectFilter === "계약" ? "bold" : "normal"
                }
              >
                계약
              </MenuItem>
              <MenuItem
                value="진행중"
                onClick={() => setSelectedProjectFilter("진행중")}
                bg={
                  selectedProjectFilter === "진행중"
                    ? hoverBgColor
                    : "transparent"
                }
                _hover={{ bg: hoverBgColor }}
                fontWeight={
                  selectedProjectFilter === "진행중" ? "bold" : "normal"
                }
              >
                진행중
              </MenuItem>
              <MenuItem
                value="납품완료"
                onClick={() => setSelectedProjectFilter("납품완료")}
                bg={
                  selectedProjectFilter === "납품완료"
                    ? hoverBgColor
                    : "transparent"
                }
                _hover={{ bg: hoverBgColor }}
                fontWeight={
                  selectedProjectFilter === "납품완료" ? "bold" : "normal"
                }
              >
                납품완료
              </MenuItem>
            </MenuContent>
          </MenuRoot>
          <Flex
            flexDirection="column"
            justifyContent="center"
            height="100%" // ✅ 높이를 명확하게 설정
            overflowY="auto" // ✅ 내부 콘텐츠가 많을 경우 스크롤 가능하도록 설정
            css={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "gray.400",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "gray.500",
              },
            }}
          >
            {projectList.map((project) => {
              const isRowClickable = Number(project.clickable) === 1;

              return (
                <Link
                  key={project.id}
                  href={
                    isRowClickable ? `/projects/${project.id}/approvals` : "#"
                  }
                  passHref
                  onClick={(e) => {
                    if (!isRowClickable) e.preventDefault(); // 클릭 방지
                  }}
                >
                  <Box
                    p={4}
                    textAlign="center"
                    borderBottom="1px solid"
                    borderColor={borderColor}
                    _hover={isRowClickable ? { bg: hoverBgColor } : {}}
                    overflowX="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    maxWidth={menuWidth}
                    cursor={isRowClickable ? "pointer" : "not-allowed"}
                    opacity={isRowClickable ? 1 : 0.6}
                    color={isRowClickable ? "inherit" : "gray.500"}
                  >
                    {project.name}
                  </Box>
                </Link>
              );
            })}
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
