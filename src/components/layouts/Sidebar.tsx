"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Flex,
  Separator,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  Home,
  Briefcase,
  Building,
  Users,
  Bell,
  ChevronDown,
  Folder,
} from "lucide-react";
import { useSidebar } from "@/src/context/SidebarContext";
import { useProjectInfiniteScroll } from "@/src/hook/useProjectInfiniteScroll";
import { Loading } from "@/src/components/common/Loading"; // 기존 컴포넌트 사용
import { layoutStyles } from "@/src/styles/layoutStyles";

interface SidebarProps {
  loggedInUserRole: string | undefined;
  isOpen: boolean;
  isSidebarOverlayPage: boolean;
  onToggle: (isOpen: boolean) => void; // 사이드바 토글 함수 추가
}

// 메뉴 항목 상수
const MENU_ITEMS = {
  admin: [
    { value: "/", title: "프로젝트 관리", icon: Briefcase },
    { value: "/admin/organizations", title: "업체 관리", icon: Building },
    { value: "/admin/members", title: "회원 관리", icon: Users },
    { value: "/notices", title: "공지사항 관리", icon: Bell },
  ],
  member: [
    { value: "/", title: "홈", icon: Home },
    { value: "/notices", title: "공지사항", icon: Bell },
  ],
};

export default function Sidebar({
  loggedInUserRole,
  isOpen,
  isSidebarOverlayPage,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname(); // 현재 페이지 경로 가져오기
  const isMobile = useBreakpointValue({ base: true, md: false });
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false); // true: 아이콘 표시
  const [showAllProjects, setShowAllProjects] = useState(false); // 더보기 버튼 상태 관리

  // 현재 사용자 권한에 따라 메뉴 아이템 선택
  const memberRole = loggedInUserRole === "ADMIN" ? "admin" : "member";
  const menuItems = MENU_ITEMS[memberRole] || [];

  // 일반 회원 프로젝트 필터링 관련 로직
  const { selectedProjectFilter } = useSidebar();
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

  //  프로젝트 상태에 따른 데이터 가져오기
  const { projectList, loading, hasMore, observerRef } =
    useProjectInfiniteScroll(memberRole === "member" ? managementStep : "");

  const projectId = pathname.match(/\/projects\/(\d+)/)?.[1];

  // ✅ 페이지가 변경될 때 showAllProjects 초기화
  useEffect(() => {
    setShowAllProjects(false); // 페이지 이동 시 프로젝트 목록을 5개만 보이도록 리셋
  }, [pathname]); // pathname이 변경될 때마다 실행

  // 모바일 화면에서는 자동으로 닫기
  useEffect(() => {
    if (isMobile) {
      onToggle(false);
      setIsCollapsed(false);
    }
  }, [isMobile, onToggle]);

  // 사이드바 바깥 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onToggle(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <Flex
      as="aside"
      ref={sidebarRef} // 사이드바 ref 추가
      {...layoutStyles.sidebar(isOpen, isSidebarOverlayPage)}
      justifyContent="flex-start"
      fontSize="0.9rem"
    >
      <Box padding="0.5rem 0 0 0.5rem" width="100%">
        {/*  공통 메뉴 렌더링 */}
        <Box width="100%">
          {menuItems.map(({ value, title, icon: Icon }) => {
            // "/" (홈)일 때는 `pathname === value`로만 비교 ("/admin/members" 같은 곳에서 홈이 활성화되는 문제 방지)
            const isActive =
              value === "/" ? pathname === value : pathname.startsWith(value);

            return (
              <Link key={value} href={value}>
                <Flex
                  direction="row"
                  padding="1rem"
                  alignItems="center"
                  gap="1rem"
                  width="100%"
                  overflow="hidden"
                  bg={isActive ? "blue.100" : "transparent"} // 현재 페이지면 배경색 적용
                  fontWeight={isActive ? "bold" : "normal"} // 현재 페이지면 볼드 처리
                  borderLeft={
                    isActive ? "4px solid #007bff" : "4px solid transparent"
                  } // ✅ 현재 페이지면 왼쪽 포인트
                  _hover={{ bg: "gray.100" }}
                >
                  <Box flexShrink={0}>{Icon && <Icon size={20} />}</Box>
                  <Box
                    flex="1"
                    whiteSpace="nowrap" //  텍스트 한 줄 유지
                    overflow="hidden" //  넘치는 텍스트 숨김
                    textOverflow="ellipsis" //  말줄임 처리
                  >
                    {title}
                  </Box>
                </Flex>
              </Link>
            );
          })}
        </Box>

        <Separator size="sm" />
        {/*  멤버 전용 프로젝트 리스트 */}
        {memberRole === "member" && (
          <Flex
            flexDirection="column"
            overflowY="auto"
            borderBottom="1px solid #ddd"
          >
            <Box
              marginTop="0.8rem"
              padding="0.8rem 1rem 0.8rem 1rem"
              _hover={{ bg: "gray.100" }}
              transition="background-color 0.3s ease-in-out" // ✅ 천천히 hover 효과 적용
              borderRadius="0.6rem"
              width="95%"
              fontSize="0.8rem"
              display="flex" // ✅ 플렉스 박스 적용
              alignItems="center" // ✅ 세로 중앙 정렬
              justifyContent="space-between" // ✅ 텍스트와 아이콘 사이 간격 조정
            >
              <Text>참여 중 프로젝트 &gt;</Text>
            </Box>

            {/* 프로젝트 리스트 */}
            {projectList
              .slice(0, showAllProjects ? projectList.length : 5)
              .map((project) => {
                // "/" (홈)일 때는 `pathname === value`로만 비교 ("/admin/members" 같은 곳에서 홈이 활성화되는 문제 방지)
                const isActiveProject = projectId === project.id.toString();

                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}/approvals`}
                    passHref
                  >
                    <Flex
                      direction="row"
                      alignItems="center"
                      padding={3}
                      gap="1rem"
                      overflow="hidden"
                      bg={isActiveProject ? "blue.100" : "transparent"} // 현재 페이지면 배경색 적용
                      fontWeight={isActiveProject ? "bold" : "normal"} // 현재 페이지면 볼드 처리
                      borderLeft={
                        isActiveProject
                          ? "4px solid #007bff"
                          : "4px solid transparent"
                      } // ✅ 현재 페이지면 왼쪽 포인트
                      _hover={{ bg: "gray.100" }}
                    >
                      <Box flexShrink={0}>{<Folder size={20} />}</Box>
                      <Box
                        _hover={{ bg: "gray.100" }}
                        whiteSpace="nowrap" //  텍스트 한 줄 유지
                        overflow="hidden" //  넘치는 텍스트 숨김
                        textOverflow="ellipsis" //  말줄임 처리
                      >
                        {project.name}
                      </Box>
                    </Flex>
                  </Link>
                );
              })}

            {/* 더보기 버튼 추가 */}
            {projectList.length > 5 && !showAllProjects && (
              <Box
                onClick={() => setShowAllProjects(true)}
                padding="1rem"
                _hover={{ bg: "gray.100" }}
                width="100%"
                cursor="pointer"
                fontSize="0.9rem"
              >
                <Flex direction="row" gap="0.5rem">
                  <ChevronDown />
                  <Text>더보기</Text>
                </Flex>
              </Box>
            )}
            {/* 로딩 및 무한스크롤 로직 */}
            {loading && hasMore && (
              <Box mt={4} display="flex" justifyContent="center">
                <Loading />
              </Box>
            )}
            {hasMore && <div ref={observerRef} style={{ height: "10px" }} />}
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
