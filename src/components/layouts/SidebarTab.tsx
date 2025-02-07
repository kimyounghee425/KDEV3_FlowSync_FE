import { Box, CardBody, CardRoot, CardTitle, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { useSidebar } from "@/src/context/SidebarContext";
import { useProjectInfiniteScroll } from "@/src/hook/useProjectInfiniteScroll";

interface SidebarTabProps {
  memberRole: "admin" | "member";
}

// 관리자 메뉴 항목
const ADMIN_MENU_ITEMS = [
  { value: "/admin/members", title: "회원 관리" },
  { value: "/admin/organizations", title: "업체 관리" },
  { value: "/projects/new", title: "프로젝트 생성" },
];

export default function SidebarTab({ memberRole }: SidebarTabProps) {
  const { selectedProjectFilter } = useSidebar();

  const status =
    selectedProjectFilter === "완료 프로젝트" ? "COMPLETED" : "IN_PROGRESS";

  const { projectList, loading, hasMore, observerRef } =
    useProjectInfiniteScroll(status);

  // 관리자 메뉴 렌더링
  if (memberRole === "admin") {
    return (
      <Box bg="white">
        <CardRoot boxShadow="none" backgroundColor="transparent">
          <CardBody>
            {ADMIN_MENU_ITEMS.map((item) => (
              <Link key={item.value} href={item.value} passHref>
                <CardTitle width="100%" mb="2" p="2">
                  {item.title}
                </CardTitle>
              </Link>
            ))}
          </CardBody>
        </CardRoot>
      </Box>
    );
  }

  return (
    <Box bg="white" height="calc(100vh - 60px)">
      <CardRoot boxShadow="none" backgroundColor="transparent">
        {/* ✅ 스크롤이 `SidebarTab` 내에서만 이루어지도록 설정 */}
        <CardBody
          overflowY="auto"
          maxHeight={{
            base: "calc(100vh - 120px)", // 작은 화면 (모바일)
            md: "calc(100vh - 150px)", // 중간 화면 (태블릿)
            lg: "calc(100vh - 180px)", // 큰 화면 (데스크탑)
          }}
        >
          {projectList &&
            projectList.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}/tasks`}
                passHref
              >
                <CardTitle mb="2" p="1">
                  {project.name}
                </CardTitle>
              </Link>
            ))}

          {/* ✅ 로딩 상태 표시 */}
          {loading && <Spinner size="sm" mx="auto" my="4" />}

          {/* ✅ 마지막 요소 감지 (무한 스크롤) */}
          {hasMore && <div ref={observerRef} style={{ height: "10px" }} />}
        </CardBody>
      </CardRoot>
    </Box>
  );
}
