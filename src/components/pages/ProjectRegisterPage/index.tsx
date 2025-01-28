// 프로젝트 생성 페이지

"use client";

import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import BackButton from "@/src/components/common/BackButton";
// import ProjectForm from "@/src/components/pages/ProjectRegisterPage/components/ProjectForm";
import axiosInstance from "@/src/api/axiosInstance";

interface UserInterface {
  id: string;
  // 기타 다른 key 값들 사용 안할거여도 타입 지정해주기
}

export default function ProjectRegisterPage() {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    // 작성자 id (어드민) 받는 로직 완성하기.
    const fetchUserId = async () => {
      try {
        const response = await axiosInstance.get<UserInterface>(`주소주소`);
        setId(response.data.id);
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  return (
    <Box
      maxW="1000px"
      w="100%"
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1"
      borderRadius="lg"
      boxShadow="md"
    >
      <BackButton />

      {/* <ProjectForm id={id} /> */}
    </Box>
  );
}
