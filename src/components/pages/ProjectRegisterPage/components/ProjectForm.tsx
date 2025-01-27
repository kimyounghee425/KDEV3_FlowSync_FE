"use client";

// 외부 라이브러리
import React, { useState } from "react";
import { Box, Input, Text, Flex, Button } from "@chakra-ui/react";

// 절대 경로 파일
import HeaderSection from "@/src/components/pages/ProjectRegisterPage/components/HeaderSection";
import DateSection from "@/src/components/pages/ProjectRegisterPage/components/DateSection";
import ContentSection from "@/src/components/pages/ProjectRegisterPage/components/ContentSection";

export default function ProjectForm({ id }: { id: string }) {
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("IN_PROGRESS");
  const [managementStep, setManagementStep] = useState<string>("CONTRACT");
  const [startAt, setStartAt] = useState<string>("");
  const [closeAt, setCloseAt] = useState<string>("");

  const [description, setDescription] = useState<string>(""); // 짧은 설명
  const [detail, setDetail] = useState<string>(""); // 긴 설명

  // 서버에 제출하는 로직 작성
  const handleSubmit = () => {
    console.log("제출 완료");
  };
  // console.log(startAt);
  // // 2024-12-31T15:00:00.000Z 출력

  // console.log(startAt.toLocaleString());
  // // 2024-12-31T15:00:00.000Z 출력

  // console.log(new Date(startAt));
  // // Wed Jan 01 2025 00:00:00 GMT+0900 (한국 표준시) 출력

  return (
    <Flex direction="column">
      <Box>
        <HeaderSection
          name={name}
          status={status}
          managementStep={managementStep}
          setName={setName}
          setStatus={setStatus}
          setManagementStep={setManagementStep}
        />
      </Box>
      <Box>
        <DateSection
          startAt={startAt}
          closeAt={closeAt}
          setStartAt={setStartAt}
          setCloseAt={setCloseAt}
        />
      </Box>
      <Box>
        <ContentSection
          description={description}
          detail={detail}
          setDetail={setDetail}
          setDescription={setDescription}
        />
      </Box>
      <Button onClick={handleSubmit}>작성</Button>
    </Flex>
  );
}
