import { HStack, Button } from "@chakra-ui/react";
import { PaginationProps } from "../../types";

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalCount, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const maxVisibleButtons = 10; // 한 번에 보여줄 페이지 번호 개수

  // 현재 페이지 그룹 계산
  const currentGroup = Math.ceil(currentPage / maxVisibleButtons);

  // 그룹의 시작 및 끝 페이지 계산
  const startPage = (currentGroup - 1) * maxVisibleButtons + 1;
  const endPage = Math.min(currentGroup * maxVisibleButtons, totalPages);

  return (
    <HStack wrap="wrap" justify="center" mt={4}>
      {/* 이전 그룹 버튼 */}
      <Button
        size="sm"
        onClick={() => {
          if (currentGroup !== 1) onPageChange(startPage - 1);
        }}
        disabled={currentGroup === 1} // 첫 그룹에서는 비활성화
        bg={currentGroup === 1 ? "gray.400" : "blue.600"} // 비활성화 상태 배경색
        color={currentGroup === 1 ? "gray.600" : "white"} // 비활성화 상태 텍스트 색상
        _hover={currentGroup === 1 ? {} : { bg: "blue.700" }} // 비활성화 시 호버 제거
        cursor={currentGroup === 1 ? "not-allowed" : "pointer"} // 비활성화 상태 커서
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
            bg={page === currentPage ? "blue.600" : "gray.200"} // 현재 페이지와 일반 페이지 색상
            color={page === currentPage ? "white" : "gray.800"} // 현재 페이지와 일반 페이지 텍스트 색상
            _hover={
              page === currentPage
                ? {} // 현재 페이지는 호버 효과 없음
                : { bg: "gray.300" } // 일반 페이지의 호버 색상
            }
            cursor={page === currentPage ? "default" : "pointer"} // 현재 페이지는 커서 기본값
          >
            {page}
          </Button>
        );
      })}

      {/* 다음 그룹 버튼 */}
      <Button
        size="sm"
        onClick={() => {
          if (endPage !== totalPages) onPageChange(endPage + 1);
        }}
        isDisabled={endPage === totalPages} // 마지막 그룹에서는 비활성화
        bg={endPage === totalPages ? "gray.400" : "blue.600"} // 비활성화 상태 배경색
        color={endPage === totalPages ? "gray.600" : "white"} // 비활성화 상태 텍스트 색상
        _hover={endPage === totalPages ? {} : { bg: "blue.700" }} // 비활성화 시 호버 제거
        cursor={endPage === totalPages ? "not-allowed" : "pointer"} // 비활성화 상태 커서
      >
        다음
      </Button>
    </HStack>
  );
};

export default Pagination;
