"use client";

import { HStack, Input, Button, Box, Flex } from "@chakra-ui/react";
import { ChangeEvent, KeyboardEvent } from "react";
import { SelectBox } from "./SelectBox";

interface SearchSectionProps {
  query: string;
  filter: string;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSearch: (query: string, filter: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  query,
  filter,
  onQueryChange,
  onFilterChange,
  onSearch,
}) => {
  // Enter 키 입력 처리 함수
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(query, filter);
    }
  };
  return (
    <Box>
      <Flex gap={4} alignItems="center" justifyContent="space-between">
        <HStack>
          <Input
            placeholder="프로젝트명 검색"
            size="md"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onQueryChange(e.target.value)
            }
            onKeyDown={handleKeyPress}
            width="400px"
          />
          <Button colorPalette="blue" onClick={() => onSearch(query, filter)}>
            검색
          </Button>
          <Button
            colorPalette="gray"
            onClick={() => {
              onQueryChange("");
            }}
          >
            초기화
          </Button>
        </HStack>
        <SelectBox
          placeholder="프로젝트 상태 필터링"
          value={filter}
          onChange={(value) => onFilterChange(value)}
        >
          <option value="all">전체</option>
          <option value="contract">계약</option>
          <option value="inProgress">진행중</option>
          <option value="completed">납품완료</option>
          <option value="maintenance">하자보수</option>
          <option value="paused">일시중단</option>
          <option value="deleted">삭제(관리자용)</option>
        </SelectBox>
      </Flex>
    </Box>
  );
};

export default SearchSection;
