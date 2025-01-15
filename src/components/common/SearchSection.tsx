import { createListCollection } from "@chakra-ui/react";
import { HStack, Input, Button, Box, Flex } from "@chakra-ui/react";
import { ChangeEvent, KeyboardEvent } from "react";
import SelectBox from "./SelectBox";
import { useProjectsData } from "@/src/context/ProjectsContext";

const frameworks = createListCollection<{ label: string; value: string }>({
  items: [
    { label: "전체", value: "전체" },
    { label: "계약", value: "계약" },
    { label: "진행중", value: "진행중" },
    { label: "납품완료", value: "납품완료" },
    { label: "하자보수", value: "하자보수" },
    { label: "일시중단", value: "일시중단" },
    { label: "삭제(관리자용)", value: "삭제(관리자용)" },
  ],
});

const SearchSection = ({}) => {
  const { query, input, setInput, setQuery, fetchData, setFilter } =
    useProjectsData();

  // 검색 버튼을 클릭하거나 엔터 입력시 데이터를 가져오는 함수
  const onSubmit = () => {
    if (!input || query === input) return;
    fetchData();
  };

  // 검색어와 필터 상태값 초기화 함수
  const resetSearch = () => {
    setQuery("");
    setInput("");
    setFilter("전체");
  };

  // 사용자가 input 태그에 이력하는 값을 실시간으로 query state에 보관
  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Enter 키 입력 처리 함수
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setQuery(input);
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
};

export default SearchSection;
