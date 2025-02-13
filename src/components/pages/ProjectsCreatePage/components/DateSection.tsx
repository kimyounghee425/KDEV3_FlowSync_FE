import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex, Text, Box, Input } from "@chakra-ui/react";

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
      console.log("선택한 시작일:", date); // ✅ 선택한 날짜 확인
      console.log("ISO 변환 값:", date.toISOString()); // ✅ 변환된 값 확인
      setStartAt(date.toISOString());
      if (!closeAt || new Date(closeAt) < date) {
        setCloseAt("");
      }
    }
  };

  const handleCloseDateChange = (date: Date | null) => {
    if (date) {
      if (startAt && new Date(startAt) > date) return; // 종료일이 등록일보다 빠를 수 없음
      console.log("선택한 종료일:", date); // ✅ 선택한 날짜 확인
      console.log("ISO 변환 값:", date.toISOString()); // ✅ 변환된 값 확인
      setCloseAt(date.toISOString());
    }
  };

  return (
    <Flex direction="column" width="100%">
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
              minDate={new Date()}
              popperPlacement="bottom-start"
              calendarClassName="datepicker-calendar" // ✅ 캘린더 스타일 추가 가능
              wrapperClassName="datepicker-wrapper" // ✅ Wrapper 스타일 적용
              customInput={
                <Input
                  placeholder="날짜를 선택하세요"
                  value={
                    startAt ? new Date(startAt).toLocaleDateString("ko-KR") : ""
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
              selected={closeAt ? new Date(closeAt) : null}
              onChange={handleCloseDateChange}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              popperPlacement="bottom-start"
              calendarClassName="datepicker-calendar" // ✅ 캘린더 스타일 추가 가능
              wrapperClassName="datepicker-wrapper" // ✅ Wrapper 스타일 적용
              customInput={
                <Input
                  placeholder="날짜를 선택하세요"
                  value={
                    closeAt ? new Date(closeAt).toLocaleDateString("ko-KR") : ""
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
  );
}
