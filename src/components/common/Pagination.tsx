import { HStack, Button } from "@chakra-ui/react";
import { PaginationMeta } from "@/src/types";

interface PaginationProps {
  meta: PaginationMeta; // PaginationMeta 전체를 전달받음
  onPageChange: (page: number) => void; // 페이지 변경 핸들러
}

const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { currentPage, totalPages, isFirstPage, isLastPage } = meta; // 필요한 데이터만 추출
  const maxVisibleButtons = 10; // 한 번에 보여줄 페이지 번호 개수

  // 현재 페이지 그룹 계산
  const currentGroup = Math.ceil(currentPage / maxVisibleButtons);
  const startPage = (currentGroup - 1) * maxVisibleButtons + 1;
  const endPage = Math.min(currentGroup * maxVisibleButtons, totalPages);

  return (
    <HStack wrap="wrap" justify="center" mt={4}>
      {/* 이전 버튼 */}
      <Button
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
      >
        이전
      </Button>

      {/* 페이지 번호 버튼 */}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
        const page = startPage + i;
        return (
          <Button
            size="sm"
            key={page}
            onClick={() => onPageChange(page)}
            bg={page === currentPage ? "blue.600" : "gray.200"}
            color={page === currentPage ? "white" : "gray.800"}
          >
            {page}
          </Button>
        );
      })}

      {/* 다음 버튼 */}
      <Button
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
      >
        다음
      </Button>
    </HStack>
  );
};

export default Pagination;
