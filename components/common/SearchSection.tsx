"use client";

import { HStack, Input, Button, Heading, Box } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";

const SearchSection = () => {
  const [query, setQuery] = useState<string>("");

  const handleSearch = () => {
    console.log("검색어:", query);
    // 검색 로직 추가 가능
  };

  return (
    <Box>
      <Heading size="2xl" mb={4}>
        프로젝트 목록
      </Heading>
      <HStack mb={6} gap={4}>
        <Input
          placeholder="프로젝트 검색"
          size="md"
          width={600}
          variant="outline"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
        />
        <Button colorScheme="teal" onClick={handleSearch}>
          검색
        </Button>
      </HStack>
    </Box>
  );
};

export default SearchSection;
