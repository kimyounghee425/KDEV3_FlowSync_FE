"use client";

import { Box, Text } from "@chakra-ui/react";

interface ProgressStep {
  stepId: string; // 진행단계 고유 ID
  title: string; // 진행단계 이름
  color?: string; // 백엔드에서 받은 색상 (선택적)
  description?: string; // 설명 (선택적)
}

interface ProgressTagProps {
  step: ProgressStep;
}

// 기본값 (백엔드에서 색상을 받지 못한 경우 사용)
const DEFAULT_COLOR = "#333333";

export default function ProgressTag({ step }: ProgressTagProps) {
  const color = step.color || DEFAULT_COLOR; // 백엔드에서 받은 color를 사용, 없으면 기본값

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        display="inline-flex"
        backgroundColor="#F9F9F9"
        paddingX="10px"
        paddingY="6px"
        justifyContent="center"
        alignItems="center"
        borderRadius="6px"
        color={color}
        fontSize={{ base: "12px", md: "14px", lg: "16px" }}
        fontWeight="500"
        letterSpacing="-0.28px"
        minWidth="60px"
        minHeight="30px"
        flexShrink={0}
        textAlign="center"
        border={`1px solid ${color}`}
      >
        <Text whiteSpace="nowrap">{step.title}</Text>
      </Box>
    </Box>
  );
}
