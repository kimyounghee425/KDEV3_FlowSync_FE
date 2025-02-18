"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Text } from "@chakra-ui/react";
import { login } from "@/src/api/auth";
import { useForm } from "@/src/hook/useForm";
import InputForm from "@/src/components/common/InputForm";
import { defaultValuesOfLogin } from "@/src/constants/defaultValues";
import { validationRulesOfLogin } from "@/src/constants/validationRules";
import styles from "@/src/components/pages/LoginPage/Login.module.css";
import Image from "next/image";

export const GUIDE_MESSAGE = `
  본 애플리케이션은 B2B 기업 회원 전용 서비스로 기획되었습니다. 테스트를 위한 계정 정보를 안내 드립니다.

  - 일반 사용자
  (개발사) ID: techdom@flowsync.com / PW: 1111
  (고객사) ID: devlens@flowsync.com / PW: 1111
  - 시스템 관리자
  (관리사) )ID: admin@flowsync.com / PW: 1111`;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  // const [showGuide, setShowGuide] = useState(false); // Popover 메시지 상태
  const route = useRouter();
  const { inputValues, inputErrors, handleInputChange, checkAllInputs } =
    useForm(defaultValuesOfLogin, validationRulesOfLogin);

  useEffect(() => {
    // MAC 시스템 다크모드 사용자 설정 감지
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.className = darkMode ? "dark" : "light";

    if (localStorage.getItem("user")) {
      localStorage.removeItem("user");
    }

    if (localStorage.getItem("selectedProjectFilter")) {
      localStorage.removeItem("selectedProjectFilter");
    }
  }, []);

  // #TODO 차크라UI 컴포넌트 사용 - 에러메시지 또는 로딩 UI
  function validateLoginInputs() {
    if (!checkAllInputs()) {
      alert("입력값을 확인하세요.");
      return false;
    }

    // 공백 입력 시 경고 메시지 출력
    if (inputValues.email.includes(" ")) {
      alert("이메일에는 공백을 포함할 수 없습니다.");
      return false;
    }

    if (inputValues.password.includes(" ")) {
      alert("비밀번호에는 공백을 포함할 수 없습니다.");
      return false;
    }
    return true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return; // 이미 로딩 중이라면 요청 중단
    if (!validateLoginInputs()) return; // 입력값 유효성 검사 실패 시 요청 중단

    try {
      setIsLoading(true);
      const response = await login(inputValues.email, inputValues.password);
      route.push("/");
    } catch (error) {
      console.error("로그인 실패:", error);
    } finally {
      setIsLoading(false); // 로딩 상태 해제
    }
  }

  return (
    <Box className={styles.loginContainer}>
      {/* 로그인 컴포넌트 */}
      <Box className={styles.loginCard}>
        <Box className={styles.loginHeader}>
          <Box className={styles.loginLogo}>
            <Image
              src="/logo.png" // public 디렉토리의 로고 파일 경로
              alt="FlowSync"
              width={35} // 원하는 크기로 설정
              height={35}
              objectFit="contain"
              priority
            />
            <Text className={styles.loginLogoName}>FlowSync</Text>
          </Box>
          <Text className={styles.loginTitle}>
            기업 회원 전용 페이지에 오신 것을 환영합니다!
          </Text>
        </Box>
        {/* 가이드 메시지 */}
        {/* className={`${styles.guideMessage} ${showGuide ? styles.show : ""}`} */}
        <Box className={styles.guideMessage}>
          <Text color="var(--text-light)" whiteSpace="pre-line">
            {GUIDE_MESSAGE}
          </Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <Box className={styles.inputFieldContainer}>
            <Box className={styles.inputWithButton}>
              <InputForm
                id="email"
                type="email"
                label="Email Address"
                placeholder="이메일을 입력하세요."
                value={inputValues.email}
                error={inputErrors.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {/* <Button
                onClick={() => setShowGuide((prev) => !prev)}
                className={styles.popoverButton}
              >
                계정 안내
              </Button> */}
            </Box>
            <InputForm
              id="password"
              type="password"
              label="Password"
              placeholder="패스워드를 입력하세요."
              value={inputValues.password}
              error={inputErrors.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
            <Box className={styles.loginButtonContainer}>
              <Button
                type="submit"
                className={styles.loginButton}
                disabled={isLoading}
              >
                {isLoading ? "로딩 중..." : "로그인"}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
