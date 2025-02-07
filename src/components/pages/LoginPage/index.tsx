"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Text, VStack } from "@chakra-ui/react";
import { login } from "@/src/api/auth";
import { useForm } from "@/src/hook/useForm";
import InputForm from "@/src/components/common/InputForm";
import { defaultValuesOfLogin } from "@/src/constants/defaultValues";
import { validationRulesOfLogin } from "@/src/constants/validationRules";
import styles from "@/src/components/pages/loginPage/Login.module.css";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const { inputValues, inputErrors, handleInputChange, checkAllInputs } =
    useForm(defaultValuesOfLogin, validationRulesOfLogin);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      localStorage.removeItem("user");
    }

    if (localStorage.getItem("selectedProjectFilter")) {
      localStorage.removeItem("selectedProjectFilter");
    }
    // MAC 시스템 다크모드 사용자 테마 라이트로 강제 설정
    localStorage.setItem("theme", "light");
  }, []);

  function validateInputs() {
    if (!checkAllInputs()) {
      alert("입력값을 확인하세요.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputValues.email)) {
      alert("유효한 이메일 형식을 입력하세요.");
      return false;
    }

    if (inputValues.password.length < 4) {
      alert("패스워드는 최소 4자 이상이어야 합니다.");
      return false;
    }

    return true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return; // 이미 로딩 중이라면 요청 중단
    if (!validateInputs()) return;

    try {
      setIsLoading(true);
      const response = await login(inputValues.email, inputValues.password);
      console.log("로그인 성공:", response);
      route.push("/");
    } catch (error) {
      console.error("로그인 처리 실패:", error);
    } finally {
      setIsLoading(false); // 로딩 상태 해제
    }
  }

  return (
    <>
      {/* 로그인 가이드 (오른쪽) */}
      <Box
        position="absolute"
        top="10%"
        right="10%"
        zIndex="10"
        width="400px"
        height="600px"
        maxWidth="400px"
        maxHeight="600px"
        padding={6}
        border="1px solid "
        backgroundColor="aquamarine"
        borderRadius="lg"
        boxShadow="md"
        textAlign="left"
      >
        <Text fontSize="md" color="gray.700" whiteSpace="pre-line">
          {`
              * 가이드라인: 본 애플리케이션은 B2B 서비스로 관리자가 직접 회원을 등록하며, 전달받은 ID 와 PW 를 입력하여 로그인합니다.              
            
              서비스 사용 테스트를 위한 로그인 계정을 안내 드립니다.

              아래 계정으로 로그인하여 B2B 프로젝트 관리 서비스를 이용해주시면 감사하겠습니다.

              [개발사] 소속 담당자 계정
              - ID: techdom@flowsync.com
              - PW: 1111

              [고객사] 소속 담당자 계정
              - ID: devlens@flowsync.com
              - PW: 1111

              [시스템 관리자] 계정
              - ID: admin@flowsync.com
              - PW: 1111
              `}
        </Text>
      </Box>
      <div className={styles.loginContainer}>
        {/* 제목 */}
        <div className={styles.loginHeader}>
          <Text fontSize="5xl" as="span" role="img" aria-label="document">
            📄
          </Text>
          <h1 className={styles.loginTitle}>BN SYSTEM</h1>
          <p className={styles.loginSubtitle}>
            기업 회원 전용 페이지에 오신 것을 환영합니다!
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className={styles.loginCard}>
          <form onSubmit={handleSubmit}>
            <VStack className={styles.inputFieldContainer}>
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
              <button
                type="submit"
                className={styles.loginButton}
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
            </VStack>
          </form>
        </div>
      </div>
    </>
  );
}

{
  /* <PopoverRoot>
        <PopoverTrigger asChild>
          <button className={styles.popoverButton}>도움말</button>
        </PopoverTrigger>
        <PopoverContent css={{ "--popover-bg": "lightblue" }}>
          <PopoverArrow />
          <PopoverBody>
            <PopoverTitle fontWeight="medium">
              <strong>이용 가이드</strong>
            </PopoverTitle>
            <Text fontSize="sm" color="gray.600" whiteSpace="pre-line">
              {`
              * 가이드라인: 본 애플리케이션은 B2B 서비스로 관리자가 직접 회원을 등록하며, 전달받은 ID 와 PW 를 입력하여 로그인합니다.              
              
              [관리자 계정]
              - ID: admin@example.com
              - PW: 1111

              [일반사용자(개발사) 계정]
              - ID: developermember@example.com
              - PW: 1111

              [일반사용자(고객사) 계정]
              - ID: customermember@example.com
              - PW: 1111
              `}
            </Text>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot> */
}
