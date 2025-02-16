"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex, Box, Input } from "@chakra-ui/react";

interface DateSectionProps {
  dateTime?: Date | null;
  setDateTime?: (value: Date | null) => void;
  minDate?: Date | null;
}

export default function DateSection({
  dateTime,
  setDateTime,
  minDate,
}: DateSectionProps) {
  // `minDate`가 존재하면 초와 밀리초 제거 (시간 비교를 위해)
  const adjustedMinDate = minDate
    ? new Date(minDate.setSeconds(0, 0))
    : new Date();

  // 같은 날짜인지 확인
  const isSameDay =
    dateTime && minDate
      ? dateTime.toDateString() === minDate.toDateString()
      : false;

  // ✅ 같은 날짜이면 `startAt` 이후의 시간만 선택 가능
  const minTime = isSameDay
    ? (minDate ?? undefined)
    : new Date(0, 0, 0, 0, 0, 0);
  const maxTime = new Date(0, 0, 0, 23, 59, 59); // 하루 끝 (23:59:59)까지 선택 가능

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
          {/* <Text fontSize="1rem" fontWeight="bold" mb="0.5rem">
            시작일
          </Text> */}
          <Box width="100%">
            <DatePicker
              selected={dateTime}
              onChange={setDateTime}
              dateFormat="yyyy-MM-dd HH:mm"
              showTimeSelect // 시간 선택 활성화
              timeFormat="HH:mm" // 4시간제 포맷
              timeIntervals={60} // 10분 단위 선택
              minDate={adjustedMinDate} // startAt보다 과거 선택 불가
              {...(isSameDay && { minTime, maxTime })} // ✅ 같은 날짜면 시간도 제한
              popperPlacement="bottom-start"
              customInput={
                <Input
                  placeholder="날짜를 선택하세요"
                  value={dateTime ? dateTime.toLocaleDateString("ko-KR") : ""}
                  readOnly
                  width="100%"
                  height="3rem"
                  padding="0.75rem"
                  borderRadius="0.5rem"
                  border="1px solid #ccc"
                  lineHeight="1.5rem"
                  textAlign="center"
                />
              }
            />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
