import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex, Text, Box, Input, Button } from "@chakra-ui/react";
import { useState } from "react";

interface DateSectionProps {
  startAt: string;
  closeAt: string;
  setStartAt: (value: string) => void;
  setCloseAt: (value: string) => void;
}

export default function DateSection({
  startAt,
  closeAt,
  setStartAt,
  setCloseAt,
}: DateSectionProps) {
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setStartAt(date.toISOString());
      if (!closeAt || new Date(closeAt) < date) {
        setCloseAt("");
      }
    }
  };

  const handleCloseDateChange = (date: Date | null) => {
    if (date) {
      if (startAt && new Date(startAt) > date) return; // 종료일이 등록일보다 빠를 수 없음
      setCloseAt(date.toISOString());
    }
  };

  const handleResetDates = () => {
    setStartAt("ㅇ");
    setCloseAt("ㅇ");
  };

  return (
    <Flex direction="row" width="100%">
      <Flex alignItems="center">
        {/* 상단 행 (시작일 & 종료일) */}
        <Flex
          direction={{ base: "column", md: "row" }} // 모바일에서는 column, PC에서는 row 유지
          wrap="wrap"
          justifyContent="space-between"
          maxWidth="100%" // ✅ 프로젝트 상세 내용과 너비 동일하게 설정
          width="100%"
          gap="1rem"
          alignItems="center"
        >
          {/* 시작일 선택 */}
          <Box flex="1" minWidth="12rem" width="100%">
            <Text fontSize="1rem" fontWeight="bold" mb="0.5rem">
              프로젝트 시작일
            </Text>
            <Box width="100%">
              <DatePicker
                openToDate={closeAt ? new Date(closeAt) : new Date()}
                selected={startAt ? new Date(startAt) : null}
                onChange={handleStartDateChange}
                dateFormat="yyyy-MM-dd"
                // minDate={new Date()}
                maxDate={closeAt ? new Date(closeAt) : undefined}
                popperPlacement="bottom-start"
                calendarClassName="datepicker-calendar" // ✅ 캘린더 스타일 추가 가능
                wrapperClassName="datepicker-wrapper" // ✅ Wrapper 스타일 적용
                customInput={
                  <Input
                    placeholder="날짜를 선택하세요"
                    value={
                      startAt
                        ? new Date(startAt).toLocaleDateString("ko-KR")
                        : ""
                    }
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

          {/* 종료일 선택 */}
          <Box flex="1" minWidth="12rem" width="100%">
            <Text fontSize="1rem" fontWeight="bold" mb="0.5rem">
              프로젝트 종료일
            </Text>
            <Box width="100%">
              <DatePicker
                openToDate={startAt ? new Date(startAt) : new Date()}
                selected={closeAt ? new Date(closeAt) : null}
                onChange={handleCloseDateChange}
                dateFormat="yyyy-MM-dd"
                minDate={startAt ? new Date(startAt) : undefined}
                popperPlacement="bottom-start"
                calendarClassName="datepicker-calendar" // ✅ 캘린더 스타일 추가 가능
                wrapperClassName="datepicker-wrapper" // ✅ Wrapper 스타일 적용
                customInput={
                  <Input
                    placeholder="날짜를 선택하세요"
                    value={
                      closeAt
                        ? new Date(closeAt).toLocaleDateString("ko-KR")
                        : ""
                    }
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
      <Button
        backgroundColor={"white"}
        borderColor={"gray.300"}
        borderRadius={"lg"}
        _hover={{ backgroundColor: "gray.400" }}
        onClick={handleResetDates}
        width="100px"
        alignSelf="center"
        mt={8}
        mr={10}
      >
        초기화
      </Button>
    </Flex>
  );
}
