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
        <Flex direction="row" justifyContent="space-between">
          <Text fontWeight="bold" mb={2}>
            프로젝트 개요
          </Text>
          <Text textAlign="right" color="gray.500">
            {description.length} / {255}
          </Text>
        </Flex>
        <Textarea
          placeholder="내용을 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          border="1px solid #ccc"
          borderRadius="0.5rem"
          p="0.75rem"
          width="100%"
          minHeight="5rem"
          overflowY="auto"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "5rem";
            target.style.height = `${target.scrollHeight}px`;
          }}
          maxLength={255}
          autoresize
        />
      </Box>

      {/* detail 입력 필드 */}
      <Box flex="1">
        <Flex direction="row" justifyContent="space-between">
          <Text fontWeight="bold" mb={2}>
            프로젝트 상세 내용
          </Text>
          <Text textAlign="right" color="gray.500">
            {detail.length} / {500}
          </Text>
        </Flex>
        <Textarea
          placeholder="내용을 입력하세요"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          border="1px solid #ccc"
          borderRadius="0.5rem"
          p="0.75rem"
          width="100%"
          minHeight="5rem"
          overflowY="auto"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "5rem";
            target.style.height = `${target.scrollHeight}px`;
          }}
          maxLength={500}
          autoresize
        />
      </Box>
    </Flex>
  );
}
