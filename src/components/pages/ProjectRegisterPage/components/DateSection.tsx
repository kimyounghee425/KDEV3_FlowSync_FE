import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex, Text, Box, Button } from "@chakra-ui/react";
import "./dateSection.css";
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

  // iso 형식 예쁘게 변형
  const formatDate = (isoString: string): string => {
    if (!isoString) {
      return "----. --. --.";
    }
    const date = new Date(isoString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

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

  const getHighlightedDates = () => {
    if (!startAt || !closeAt) return [];
    const startDate = new Date(startAt);
    const endDate = new Date(closeAt);
    const dateArray = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return dateArray;
  }




  return (
    <Flex direction={"row"} alignItems={"center"} mb={4}>
      <Flex direction={"row"} justifyContent={"center"} gap={10}>
        {/* 등록 일시 선택 달력 */}
        <Box>
          <Text fontWeight="bold" mb={2}>
            프로젝트 등록 일시
          </Text>
          <DatePicker
            className="custom-calender"
            selected={startAt ? new Date(startAt) : null}
            onChange={handleStartDateChange}
            highlightDates={getHighlightedDates()}
            inline
          />
        </Box>

        {/* 종료 일시 선택 달력 */}
        <Box>
          <Text fontWeight="bold" mb={2}>
            프로젝트 종료 일시
          </Text>
          <DatePicker
            className="custom-calender"
            selected={closeAt ? new Date(closeAt) : null}
            onChange={handleCloseDateChange}
            minDate={startAt ? new Date(startAt) : undefined} // 종료일은 등록일 이후만 가능
            highlightDates={getHighlightedDates()}
            inline
          />
        </Box>
      </Flex>

      {/* 선택된 날짜 표시 */}
      <Flex direction={"column"} alignItems={"center"} ml={20}>
        <Box
          border="2px solid blue"
          borderRadius={"lg"}
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={3}
          mb={10}
          width="200px"
        >
          <Text>등록 일시</Text>
          <Text>{formatDate(startAt)}</Text>
        </Box>

        <Box
          border="2px solid grey"
          borderRadius={"lg"}
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={3}
          mb={5}
          width="200px"
        >
          <Text>종료 일시</Text>
          <Text>{formatDate(closeAt)}</Text>
        </Box>

        <Button
          borderRadius={"lg"}
          onClick={() => {
            setStartAt("");
            setCloseAt("");
          }}
        >
          초기화
        </Button>
      </Flex>
    </Flex>
  );
}
