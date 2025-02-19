import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex, Text, Box, Input, Button } from "@chakra-ui/react";
import { formatDate, formatDateWithoutTime } from "@/src/utils/formatDateUtil"; // ✅ 날짜 변환 유틸 함수

interface DateSectionProps {
  startAt?: string;
  deadlineAt?: string;
  setStartAt?: (value: string) => void;
  setDeadlineAt?: (value: string) => void;
}

export default function DateSection({
  startAt,
  deadlineAt,
  setStartAt,
  setDeadlineAt,
}: DateSectionProps) {
  // ✅ 날짜 선택 핸들러 (string 변환 후 저장)
  const handleStartDateChange = (date: Date | null) => {
    if (date && setStartAt) {
      setStartAt(`${formatDateWithoutTime(date)}`); // ✅ 문자열 변환 후 저장
      if (deadlineAt && new Date(deadlineAt) < date) {
        setStartAt?.("");
      }
    }
  };

  const handleDeadlineDateChange = (date: Date | null) => {
    if (date && setDeadlineAt) {
      setDeadlineAt(`${formatDateWithoutTime(date)}`); // ✅ 문자열 변환 후 저장
      if (startAt && new Date(startAt) > date) {
        setDeadlineAt?.("");
      } // ✅ 종료일이 등록일보다 빠를 수 없음
    }
  };

  const handleResetDates = () => {
    setStartAt?.("");
    setDeadlineAt?.("");
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
                selected={startAt ? new Date(startAt) : null}
                onChange={handleStartDateChange}
                dateFormat="yyyy-MM-dd"
                popperPlacement="bottom-start"
                openToDate={deadlineAt ? new Date(deadlineAt) : new Date()}
                maxDate={deadlineAt ? new Date(deadlineAt) : undefined}
                calendarClassName="datepicker-calendar" // ✅ 캘린더 스타일 추가 가능
                wrapperClassName="datepicker-wrapper" // ✅ Wrapper 스타일 적용
                customInput={
                  <Input
                    placeholder="날짜를 선택하세요"
                    value={startAt || ""}
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
              프로젝트 예정 마감일
            </Text>
            <Box width="100%">
              <DatePicker
                selected={deadlineAt ? new Date(deadlineAt) : null}
                onChange={handleDeadlineDateChange}
                dateFormat="yyyy-MM-dd"
                minDate={startAt ? new Date(startAt) : undefined}
                popperPlacement="bottom-start"
                openToDate={startAt ? new Date(startAt) : new Date()}
                calendarClassName="datepicker-calendar" // ✅ 캘린더 스타일 추가 가능
                wrapperClassName="datepicker-wrapper" // ✅ Wrapper 스타일 적용
                customInput={
                  <Input
                    placeholder="날짜를 선택하세요"
                    value={
                      deadlineAt
                        ? new Date(deadlineAt).toLocaleDateString("ko-KR")
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
