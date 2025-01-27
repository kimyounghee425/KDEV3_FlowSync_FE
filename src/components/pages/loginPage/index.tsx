"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { login } from "@/src/api/auth";
import { useForm } from "@/src/hook/useForm";
import InputForm from "@/src/components/common/InputForm";
import { defaultValuesOfLogin } from "@/src/constants/defaultValues";
import { validationRulesOfLogin } from "@/src/constants/validationRules";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const { inputValues, inputErrors, handleInputChange, checkAllInputs } =
    useForm(defaultValuesOfLogin, validationRulesOfLogin);

  function validateInputs() {
    if (!checkAllInputs()) {
      alert("입력값을 확인하세요.");
      return false;
    }
    return true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateInputs()) return;

    // console.log("로그인 시도 - ", inputValues);

    if (await login(inputValues.email, inputValues.password)) {
      console.log("성공적으로 로그인 되었습니다.");
      route.push("/");
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

      {/* #TODO InputFormLayout 으로 스타일링 코드 별도 분리 */}
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
              value={inputValues.email}
              error={inputErrors.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <InputForm
              id="password"
              type="password"
              label="Password"
              placeholder="패스워드를 입력하세요."
              value={inputValues.password}
              error={inputErrors.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
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
