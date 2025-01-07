"use client";
// 목데이터 사용
import { mockData } from "./data/mockData";
import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import BackButton from "@/src/components/common/backButton";
import Form from "@/src/components/common/Form";

export default function New() {
  const [author, setAuthor] = useState<string>("");
  const [createdDate, setCreatedDate] = useState<string>("");

  useEffect(() => {
    setAuthor(mockData.author);
    setCreatedDate(mockData.createdDate);
  }, []);

  return (
    <Box
      maxW="1000px"
      w={"100%"}
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <BackButton />

      <Form author={author} createdDate={createdDate} />
    </Box>
  );
}