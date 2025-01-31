import { Box, CardBody, CardRoot, CardTitle, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { useSidebar } from "@/src/context/SidebarContext";
import { useProjectInfiniteScroll } from "@/src/hook/useProjectInfiniteScroll";

interface SidebarTabProps {
  memberRole: "admin" | "member";
}

// 관리자 메뉴 항목
const ADMIN_MENU_ITEMS = [
  { value: "/", title: "홈 대시보드" },
  { value: "/admin/members", title: "회원 관리" },
  { value: "/admin/organizations", title: "업체 관리" },
];

export default function SidebarTab({ memberRole }: SidebarTabProps) {
  const { selectedProjectFilter } = useSidebar();

  const status =
    selectedProjectFilter === "완료 프로젝트" ? "COMPLETED" : "IN_PROGRESS";

  const { projectList, loading, hasMore, observerRef } =
    useProjectInfiniteScroll(status, 2);

  // 관리자 메뉴 렌더링
  if (memberRole === "admin") {
    return (
      <Box bg="gray.200">
        <CardRoot>
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
    <Box bg="gray.200" height="calc(100vh - 60px)">
      <CardRoot>
        {/* ✅ 스크롤이 `SidebarTab` 내에서만 이루어지도록 설정 */}
        <CardBody overflowY="auto" maxHeight="400px">
          {projectList.map((project) => (
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
