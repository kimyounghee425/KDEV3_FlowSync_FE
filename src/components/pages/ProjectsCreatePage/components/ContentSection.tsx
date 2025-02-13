"use client";

import { Box, Flex, Textarea, Text } from "@chakra-ui/react";

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
    <Flex width="100%" gap="1rem" padding="1rem">
      {/* description 입력 필드 */}
      <Box flex="1">
        <Text fontWeight="bold" mb={2}>
          프로젝트 개요
        </Text>
        <Textarea
          placeholder="내용을 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          border="1px solid #ccc"
          borderRadius="0.5rem"
          p="0.75rem"
          width="100%"
          height="5rem"
          overflowY="auto"
        />
      </Box>

      {/* detail 입력 필드 */}
      <Box flex="1">
        <Text fontWeight="bold" mb={2}>
          프로젝트 상세 내용
        </Text>
        <Textarea
          placeholder="내용을 입력하세요"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          border="1px solid #ccc"
          borderRadius="0.5rem"
          p="0.75rem"
          width="100%"
          height="5rem"
          overflowY="auto"
        />
      </Box>
    </Flex>
  );
}
