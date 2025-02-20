import React from "react";
import { Flex, Box, Input, Text } from "@chakra-ui/react";

const managementSteps = [
  { label: "계약", value: "CONTRACT" },
  { label: "진행중", value: "IN_PROGRESS" },
  { label: "납품완료", value: "COMPLETED" },
  { label: "하자보수", value: "MAINTENANCE" },
  { label: "일시중단", value: "PAUSED" },
  { label: "삭제", value: "DELETED" },
];

interface HeaderSectionProps {
  name: string;
  managementStep: string;
  setName: (value: string) => void;
  setManagementStep: (value: string) => void;
}

export default function HeaderSection({
  name,
  managementStep,
  setName,
  setManagementStep,
}: HeaderSectionProps) {
  return (
    <Flex direction="column" width="100%">
      {/* 상단 행 (관리 단계 선택 + 프로젝트명 입력) */}
      <Flex
        direction="column"
        wrap="wrap"
        width="100%"
        gap="1rem"
        alignItems="center"
      >
        {/* 드롭다운 (프로젝트 관리 단계 선택) */}

        <Box flex="1" minWidth="12rem" width="100%">
          <Text fontSize="1rem" fontWeight="bold" mb="0.5rem">
            프로젝트 관리 단계<span style={{ color: "red" }}>*</span>
          </Text>
          <select
            value={managementStep}
            onChange={(e) => setManagementStep(e.target.value)}
            style={{
              width: "100%",
              height: "3rem",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "0.0625rem solid #ccc",
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: "1rem",
              lineHeight: "1.5rem",
            }}
          >
            {managementSteps.map((step) => (
              <option key={step.value} value={step.value}>
                {step.label}
              </option>
            ))}
          </select>
        </Box>

        {/* 프로젝트명 입력 */}
        <Box flex="4" minWidth="12rem" width="100%">
          <Flex direction="row" justifyContent="space-between">
            <Text fontSize="1rem" fontWeight="bold" mb="0.5rem">
              프로젝트명<span style={{ color: "red" }}>*</span>
            </Text>
            <Text textAlign="right" color="gray.500">
              {name.length} / {50}{" "}
            </Text>
          </Flex>
          <Input
            placeholder="프로젝트명을 입력하세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
            width="100%"
            height="3rem"
            padding="0.75rem"
            borderRadius="0.5rem"
            border="1px solid #ccc"
            fontSize="1rem"
            lineHeight="1.5rem"
            maxLength={50}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
