"useClient";

import { ChangeEvent, KeyboardEvent, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { HStack, Input, Button, Box, Flex } from "@chakra-ui/react";

interface SearchSectionProps {
  keyword: string;
  placeholder?: string;
  children?: ReactNode;
}

export default function SearchSection({
  keyword,
  placeholder = "검색어를 입력하세요",
  children,
}: SearchSectionProps) {
  const [input, setInput] = useState<string>();
  const router = useRouter();

  // 검색 버튼을 클릭하거나 엔터 입력시 데이터를 가져오는 함수
  const onSubmit = () => {
    if (keyword === input) return;

    // URL 업데이트
    const params = new URLSearchParams(window.location.search);
    params.set("keyword", input || ""); // 검색어 추가
    params.set("currentPage", "1");
    router.push(`?${params.toString()}`);
  };

  // 검색어와 필터 상태값 초기화 함수
  const resetSearch = () => {
    // URL 쿼리스트링 초기화
    router.push("?");
    setInput("");
  };

  // 사용자가 input 태그에 이력하는 값을 실시간으로 query state에 보관
  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Enter 키 입력 처리 함수
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <Box mb="10px">
      <Flex gap={4} alignItems="center" justifyContent="end">
        <HStack>
          {children}
          <Input
            placeholder={placeholder}
            size="md"
            value={input}
            onChange={onChangeSearch}
            onKeyDown={onKeyDown}
            width="300px"
          />
          <Button variant={"surface"} onClick={onSubmit}>
            검색
          </Button>
          <Button variant={"outline"} onClick={resetSearch}>
            초기화
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}
