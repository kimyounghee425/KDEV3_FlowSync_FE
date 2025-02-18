import { HStack, Button, IconButton } from "@chakra-ui/react";
import { PaginationProps as PaginationInfo } from "@/src/types";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationProps {
  paginationInfo?: PaginationInfo; // PaginationMeta 전체를 전달받음
  handlePageChange: (page: number) => void; // 페이지 변경 핸들러
}

const Pagination: React.FC<PaginationProps> = ({
  paginationInfo,
  handlePageChange,
}) => {
  if (!paginationInfo) {
    // paginationInfo가 없는 경우 아무 것도 렌더링하지 않음
    return null;
  }

  const { currentPage, totalPages, isFirstPage, isLastPage } = paginationInfo; // 필요한 데이터만 추출
  const maxVisibleButtons = 5; // 한 번에 보여줄 페이지 번호 개수
  // 현재 페이지 그룹 계산
  const currentGroup = Math.ceil(currentPage / maxVisibleButtons);
  const startPage = (currentGroup - 1) * maxVisibleButtons + 1;
  const endPage = Math.min(currentGroup * maxVisibleButtons, totalPages);

  return (
    <HStack wrap="wrap" justify="center" mt={4} alignItems="center">
      {/* 이전 버튼 */}
      <IconButton
        aria-label="이전 페이지"
        as={ChevronLeftIcon} // 아이콘 직접 전달
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={isFirstPage}
        variant="ghost"
        size="xs"
      />

      {/* 페이지 번호 버튼 */}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
        const page = startPage + i;
        return (
          <Button
            size="sm"
            key={page}
            disabled={page === currentPage}
            onClick={() => handlePageChange(page)}
            backgroundColor="white"
            border={"none"}
          >
            {page}
          </Button>
        );
      })}

      {/* 다음 버튼 */}
      <IconButton
        aria-label="다음 페이지"
        as={ChevronRightIcon} // 아이콘 직접 전달
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={isLastPage}
        variant="ghost"
        size="xs"
      />
    </HStack>
  );
};

export default Pagination;
