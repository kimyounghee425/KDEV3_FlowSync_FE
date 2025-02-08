import React from "react";
import { Flex, Box, Textarea } from "@chakra-ui/react";

interface ContentSectionProps {
  description: string;
  detail: string;
  setDescription: (value: string) => void;
  setDetail: (value: string) => void;
}

export default function ContentSection({
  description,
  detail,
  setDetail,
  setDescription,
}: ContentSectionProps) {
  return (
    <Flex direction={"column"}>
      <Box>
        <label>description : </label>
        <Textarea
          placeholder="개요를 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Box>
      <Box>
        <label>detail : </label>
        <Textarea
          placeholder="상세 내용을 입력하세요"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
      </Box>
    </Flex>
  );
}
