import { HStack, Button } from "@chakra-ui/react";
import { PaginationInfoType } from "@/src/types";

interface PaginationProps {
  paginationInfo?: PaginationInfoType; // PaginationMeta 전체를 전달받음
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
    <HStack wrap="wrap" justify="center" mt={4}>
      {/* 이전 버튼 */}
      <Button
        variant={"surface"}
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={isFirstPage}>
        이전
      </Button>

      {/* 페이지 번호 버튼 */}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
        const page = startPage + i;
        return (
          <Button
            size="sm"
            key={page}
            disabled={page === currentPage}
            onClick={() => handlePageChange(page)}
            variant={page === currentPage ? "surface" : "outline"}>
            {page}
          </Button>
        );
      })}

      {/* 다음 버튼 */}
      <Button
        variant={"surface"}
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={isLastPage}>
        다음
      </Button>
    </HStack>
  );
};

export default Pagination;
