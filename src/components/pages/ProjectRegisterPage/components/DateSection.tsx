import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex, Text, Box, Button } from "@chakra-ui/react";

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
  // 활성 필드 두기. startAt -> closeAt 동선
  const [activeField, setActiveField] = useState<"startAt" | "closeAt">(
    "startAt",
  );

  // react-datepicker 은 선택된 날짜를 Date 객체로 반환.
  const handleDateChange = (date: Date | null) => {
    if (date) {
      // 날짜 iso 형식으로 변환 후 업뎃. 시각은 00시00분00초임
      if (activeField === "startAt") {
        setStartAt(date.toISOString());
        setCloseAt("");
        setActiveField("closeAt");
      } else {
        setCloseAt(date.toISOString());
        setActiveField("startAt");
      }
    }
  };

  // console.log(startAt);
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

  return (
    <Flex direction={"row"} mb={4}>
      <DatePicker
        selected={
          closeAt ? new Date(closeAt) : startAt ? new Date(startAt) : null
        }
        onChange={handleDateChange}
        startDate={startAt ? new Date(formatDate(startAt)) : null}
        endDate={closeAt ? new Date(formatDate(closeAt)) : null}
        inline
      />
      <Flex direction={"column"} justifyContent={"center"} ml={10}>
        {/* 등록 일시 */}
        <Box
          onClick={() => setActiveField("startAt")}
          cursor="pointer"
          mb={10}
          border={
            activeField === "startAt" ? "2px solid blue" : "2px solid grey"
          }
          borderRadius={"lg"}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Text ml={4} mr={4}>
            프로젝트 등록 일시
          </Text>
          <Text>{formatDate(startAt)}</Text>
        </Box>
        {/* 종료 일시 */}
        <Box
          onClick={() => setActiveField("closeAt")}
          cursor="pointer"
          border={
            activeField === "closeAt" ? "2px solid blue" : "2px solid grey"
          }
          borderRadius={"lg"}
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb={5}
        >
          <Text ml={4} mr={4}>
            프로젝트 종료 일시
          </Text>
          <Text>{formatDate(closeAt)}</Text>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Button
            borderRadius={"lg"}
            onClick={() => {
              setStartAt("");
              setCloseAt("");
              setActiveField("startAt");
            }}
          >
            초기화
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}
