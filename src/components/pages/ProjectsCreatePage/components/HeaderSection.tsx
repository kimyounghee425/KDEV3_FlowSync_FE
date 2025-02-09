import React from "react";
import { Flex, Box, Text, Input } from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";

interface HeaderSectionProps {
  name: string;
  status: string;
  managementStep: string;
  setName: (value: string) => void;
  setStatus: (value: string) => void;
  setManagementStep: (value: string) => void;
}

export default function HeaderSection({
  name,
  status,
  managementStep,
  setName,
  setStatus,
  setManagementStep,
}: HeaderSectionProps) {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleManagementStepChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setManagementStep(e.target.value);
  };

  return (
    <Flex direction="column">
      <Flex direction="row" mb={4}>
        <Flex direction="row" mr={10}>
          <Text mb="2" mr={2}>
            프로젝트 상태
          </Text>
          <Box mb="2">
            <Select value={status} onChange={handleStatusChange}>
              <option value={"IN_PROGRESS"}>IN_PROGRESS</option>
              <option value={"PAUSED"}>PAUSED</option>
              <option value={"COMPLETED"}>COMPLETED</option>
            </Select>
          </Box>
        </Flex>
        <Flex direction="row" mr={8}>
          <Text mb="2" mr={2}>
            프로젝트 관리 단계
          </Text>
          <Box>
            <Select
              value={managementStep}
              onChange={handleManagementStepChange}
            >
              <option value={"CONTRACT"}>CONTRACT</option>
              <option value={"IN_PROGRESS"}>IN_PROGRESS</option>
              <option value={"COMPLETED"}>COMPLETED</option>
              <option value={"MAINTENANCE"}>MAINTENANCE</option>
            </Select>
          </Box>
        </Flex>
      </Flex>

      <Box>
        <Input
          placeholder="프로젝트 이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
          mb="4"
        />
      </Box>
    </Flex>
  );
}
