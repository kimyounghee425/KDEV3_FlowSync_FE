"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/src/api/auth";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Separator,
  Span,
  Text,
} from "@chakra-ui/react";
import InputForm from "@/src/components/common/InputForm";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  function handleChange(field: string, value: string) {
    setFormData({ ...formData, [field]: value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      setError("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    setError(null); // 에러 메시지 초기화
    setIsLoading(true); // 로딩 상태 활성화

    try {
      const { token, user } = await login(formData.email, formData.password);
      // localStorage.setItem("accessToken", token);
      // localStorage.setItem("user", JSON.stringify(user));
      route.push("/"); // 대시보드 리다이렉트
    } catch (err: any) {
      setError(err.message || "로그인 실패");
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      padding="1.5"
      bg="gray.50"
    >
      {/* 제목 */}
      <Flex
        direction="column"
        align="center"
        fontWeight="medium"
        gap="2.5"
        marginBottom="8"
      >
        <Span fontSize="8xl">📄</Span>
        <Heading fontSize="4xl" fontWeight="medium">
          BN SYSTEM
        </Heading>
        <Heading
          fontSize="lg"
          fontWeight="medium"
          color="gray.600"
          textAlign="center"
        >
          기업 회원 전용 페이지에 오신 것을 환영합니다!
        </Heading>
      </Flex>

      {/* 로그인 폼 */}
      <Box
        display="flex"
        flexDirection="column"
        width="90%"
        maxW="400px"
        padding="6"
        border="1px"
        borderColor="gray.300"
        borderRadius="md"
        bg="white"
        boxShadow="sm"
      >
        <form onSubmit={handleSubmit}>
          <Flex direction="column" align="center" gap="2">
            <InputForm
              id="email"
              type="email"
              label="Email address"
              placeholder="이메일을 입력하세요."
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <InputForm
              id="password"
              type="password"
              label="Password"
              placeholder="패스워드를 입력하세요."
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />

            <Button
              type="submit"
              backgroundColor="#00a8ff"
              color="white"
              fontSize="lg"
              fontWeight="medium"
              width="100%"
              disabled={isLoading}
              _hover={{ backgroundColor: "#007acc" }}
            >
              로그인
            </Button>
          </Flex>
        </form>
        <HStack width="100%" gap="4" justify="center">
          <Text>
            <Link href="/login/find-password">비밀번호 찾기</Link>
          </Text>
          <Separator orientation="vertical" height="4" />
          <Text>아이디 찾기</Text>
        </HStack>
      </Box>
    </Flex>
  );
}
