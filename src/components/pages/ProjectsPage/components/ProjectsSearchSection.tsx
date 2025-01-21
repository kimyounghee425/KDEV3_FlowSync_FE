import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { HStack, Input, Button, Box, Flex } from "@chakra-ui/react";
import ProjectStatusSelectBox from "@/src/components/pages/projectsPage/components/ProjectsStatusSelectBox";
import { useProjectList } from "@/src/hook/useProjectList";

export default function ProjectsSearchSection() {
  const [input, setInput] = useState<string>("");
  const { keyword, fetchProjectList } = useProjectList();
  const router = useRouter();

  // 검색 버튼을 클릭하거나 엔터 입력시 데이터를 가져오는 함수
  const onSubmit = () => {
    if (!input || keyword === input) return;
    // URL 업데이트
    const params = new URLSearchParams(window.location.search);
    params.set("keyword", input); // 검색어 추가
    router.push(`?${params.toString()}`);

    // 데이터 다시 가져오기
    fetchProjectList(1, 5); // 첫 페이지 데이터 로드
  };

  // 검색어와 필터 상태값 초기화 함수
  const resetSearch = () => {
    // URL 쿼리스트링 초기화
    router.push("?");
    setInput("");
    fetchProjectList(1, 5); // 첫 페이지로 리셋
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
    <Box>
      <Flex gap={4} alignItems="center" justifyContent="end">
        <HStack>
          <ProjectStatusSelectBox />
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
}
