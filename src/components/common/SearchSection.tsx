import { createListCollection } from "@chakra-ui/react";
import { HStack, Input, Button, Box, Flex } from "@chakra-ui/react";
import { ChangeEvent, KeyboardEvent } from "react";
import { SelectBox } from "./SelectBox";
import { SearchSectionProps } from "@/src/types/search";

const frameworks = createListCollection<{ label: string; value: string }>({
  items: [
    { label: "전체", value: "all" },
    { label: "계약", value: "contract" },
    { label: "진행중", value: "inProgress" },
    { label: "납품완료", value: "completed" },
    { label: "하자보수", value: "maintenance" },
    { label: "일시중단", value: "paused" },
    { label: "삭제(관리자용)", value: "deleted" },
  ],
});

const SearchSection: React.FC<SearchSectionProps> = ({
  query,
  setQuery,
  onSubmit,
  reset,
}) => {
  // 사용자가 input 태그에 이력하는 값을 실시간으로 query state에 보관
  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Enter 키 입력 처리 함수
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <Box>
      <Flex gap={4} alignItems="center" justifyContent="end">
        <HStack>
          <SelectBox frameworks={frameworks} />
          <Input
            placeholder="프로젝트명 검색"
            size="md"
            value={query}
            onChange={onChangeSearch}
            onKeyDown={onKeyDown}
            width="300px"
          />
          <Button variant={"surface"} onClick={onSubmit}>
            검색
          </Button>
          <Button variant={"outline"} onClick={reset}>
            초기화
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default SearchSection;
