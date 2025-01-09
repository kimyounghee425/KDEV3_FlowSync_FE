"use client";

import LoginInputForm from "../../common/LoginInputForm";
import { Box, Button, Flex, Heading, Span } from "@chakra-ui/react";
import React, { useState, useTransition } from "react";
import { processLogin } from "@/src/types/loginActions";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        await processLogin(formData);
      } catch (err: any) {
        setError(err.message); // 서버에서 처리되지 않은 오류 메시지를 표시
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" padding="1.5" bg="gray.50">
      {/* 제목 */}
      <Flex direction="column" align="center" fontWeight="medium" gap="2.5" marginBottom="8">
        <Span fontSize="8xl">📄</Span>
        <Heading fontSize="4xl" fontWeight="medium">
          BN SYSTEM
        </Heading>
        <Heading fontSize="lg" fontWeight="medium" color="gray.600" textAlign="center">
          기업 회원 전용 페이지에 오신 것을 환영합니다!
        </Heading>
      </Flex>

      {/* 로그인 폼 */}
      <Box width="90%" maxW="400px" padding="6" border="1px" borderColor="gray.300" borderRadius="md" bg="white" boxShadow="sm">
        <form onSubmit={handleSubmit}>
          <Flex direction="column" align="center" gap="2">
            <LoginInputForm id="email" type="email" label="Email address" placeholder="이메일을 입력하세요." onChange={e => handleChange("email", e.target.value)} />
            <LoginInputForm id="password" type="password" label="Password" placeholder="패스워드를 입력하세요." onChange={e => handleChange("password", e.target.value)} />

            {error && <span style={{ color: "red" }}>{error}</span>}

            <Button type="submit" backgroundColor="#00a8ff" color="white" fontSize="lg" fontWeight="medium" width="100%" disabled={isPending || isSubmitting} _hover={{ backgroundColor: "#007acc" }}>
              로그인
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}
