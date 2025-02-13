"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex, Text, Box, Input } from "@chakra-ui/react";

interface DateSectionProps {
  startAt: Date | null;
  closeAt: Date | null;
  setStartAt: (value: Date | null) => void;
  setCloseAt: (value: Date | null) => void;
}

export default function DateSection({
  startAt,
  closeAt,
  setStartAt,
  setCloseAt,
}: DateSectionProps) {
  return (
    <Flex direction="column" width="100%">
      {/* 날짜 선택 UI */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        maxWidth="100%"
        width="100%"
        gap="1rem"
        alignItems="center"
      >
        {/* 시작일 선택 */}
        <Box flex="1" minWidth="14rem" width="100%">
          <Text fontSize="1rem" fontWeight="bold" mb="0.5rem">
            시작일
          </Text>
          <Box width="100%">
            <DatePicker
              selected={startAt}
              onChange={setStartAt}
              dateFormat="yyyy-MM-dd HH:mm"
              showTimeSelect // 시간 선택 활성화
              timeFormat="HH:mm" // 4시간제 포맷
              timeIntervals={60} // 10분 단위 선택
              minDate={new Date()}
              popperPlacement="bottom-start"
              customInput={
                <Input
                  placeholder="날짜를 선택하세요"
                  value={startAt ? startAt.toLocaleDateString("ko-KR") : ""}
                  readOnly
                  width="100%"
                  height="3rem"
                  padding="0.75rem"
                  borderRadius="0.5rem"
                  border="1px solid #ccc"
                  lineHeight="1.5rem"
                />
              }
            />
          </Box>
        </Box>
        -{/* 종료일 선택 */}
        <Box flex="1" minWidth="12rem" width="100%">
          <Text fontSize="1rem" fontWeight="bold" mb="0.5rem">
            예정완료일
          </Text>
          <Box width="100%">
            <DatePicker
              selected={closeAt}
              onChange={setCloseAt}
              dateFormat="yyyy-MM-dd HH:mm"
              showTimeSelect // 시간 선택 활성화
              timeFormat="HH:mm" // 4시간제 포맷
              timeIntervals={60} // 10분 단위 선택
              minDate={new Date()}
              popperPlacement="bottom-start"
              customInput={
                <Input
                  placeholder="날짜를 선택하세요"
                  value={closeAt ? closeAt.toLocaleDateString("ko-KR") : ""}
                  readOnly
                  width="100%"
                  height="3rem"
                  padding="0.75rem"
                  borderRadius="0.5rem"
                  border="1px solid #ccc"
                  lineHeight="1.5rem"
                />
              }
            />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
