"use client";

import {
  HStack,
  Input,
  Button,
  Box,
  Flex,
  createListCollection,
} from "@chakra-ui/react";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useMemberList } from "@/src/hook/useMemberList";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/src/components/ui/select";
import { useRouter } from "next/navigation";

const frameworks = createListCollection<{ label: string; value: string }>({
  items: [
    { label: "전체", value: "" },
    { label: "활성화", value: "ACTIVE" },
    { label: "비활성화", value: "INACTIVE" },
  ],
});

function SelectMemberBox() {
  const router = useRouter();

  const { filter } = useMemberList();

  const handleValueChange = (details: { value: string[] }) => {
    const selectedValue = details.value[0]; // 선택된 첫 번째 값
    const params = new URLSearchParams(window.location.search);

    if (selectedValue) {
      params.set("filter", selectedValue); // 필터값 설정
    } else {
      params.delete("filter"); // 필터값 제거
    }

    router.push(`?${params.toString()}`); // URL 업데이트
  };

  return (
    <SelectRoot
      collection={frameworks}
      size="md"
      width="110px"
      value={[filter]}
      onValueChange={handleValueChange}
    >
      <SelectTrigger>
        <SelectValueText></SelectValueText>
      </SelectTrigger>
      <SelectContent>
        {frameworks.items.map((status) => (
          <SelectItem item={status} key={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}

export default function MembersSearchSection() {
  const [input, setInput] = useState<string>();
  const { keyword, fetchBoardList } = useMemberList();
  const router = useRouter();

  // 검색 버튼을 클릭하거나 엔터 입력시 데이터를 가져오는 함수
  const onSubmit = () => {
    if (!input || keyword === input) return;
    // URL 업데이트
    const params = new URLSearchParams(window.location.search);
    params.set("query", input); // 검색어 추가
    router.push(`?${params.toString()}`);

    // 데이터 다시 가져오기
    fetchBoardList(1, 5); // 첫 페이지 데이터 로드
  };

  // 검색어와 필터 상태값 초기화 함수
  const resetSearch = () => {
    // URL 쿼리스트링 초기화
    router.push("?");
    setInput("");
    fetchBoardList(1, 5); // 첫 페이지로 리셋
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

  // 회원 생성 버튼 클릭 시 회원 생성 페이지로 이동
  const goToCreateMemberPage = () => {
    router.push("/admin/members/create"); // 회원 생성 페이지로 이동
  };

  return (
    <Box display="flex" justifyContent="space-between">
      <Button
        variant={"surface"}
        _hover={{ backgroundColor: "#00a8ff", color: "white" }}
        onClick={goToCreateMemberPage}
      >
        회원 생성
      </Button>
      <Flex gap={4} alignItems="center" justifyContent="end">
        <HStack>
          <SelectMemberBox />
          <Input
            placeholder="회원명 검색"
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
