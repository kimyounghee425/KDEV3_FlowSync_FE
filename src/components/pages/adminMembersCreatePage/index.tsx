"use client";

import { useForm } from "@/src/hook/useForm";
import InputForm from "@/src/components/common/InputForm";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import { Box, Flex, HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/src/components/ui/radio";

// 초기 입력값 세팅
const defaultValues = {
  organizationId: "123e4567-e89b-12d3-a456-426614174000",
  name: "",
  role: "MEMBER", // radio 버튼
  email: "",
  password: "https://", // <input> url 타입 기본 속성은 https:// 를 입력해야 돼서 초기값으로 세팅
  phoneNum: "",
  jobRole: "",
  jobTitle: "",
  introduction: "",
  remark: "",
};

// 입력값에 대한 검증 규칙
const validationRules = {
  organizationId: {
    isValid: (value: string) => value.trim() !== "", // trim(): value에서 공백이 모두 제거된 값을 반환
    errorMessage: "업체명을 입력하세요.",
  },
  name: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "회원 성함을 입력하세요.",
  },
  role: {
    isValid: (value: string) => ["MEMBER", "ADMIN"].includes(value),
    errorMessage: "회원 유형을 선택하세요.",
  },
  email: {
    isValid: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: "올바른 이메일 주소를 입력하세요.",
  },
  password: {
    isValid: (value: string) =>
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/.test(value),
    errorMessage:
      "영문, 숫자, 특수문자를 포함하여 최소 8자리 이상 비밀번호를 입력하시기 바랍니다.",
  },
  phoneNum: {
    isValid: (value: string) => /^\d{3}-\d{4}-\d{4}$/.test(value),
    errorMessage: "올바른 전화번호를 입력하세요.",
  },
  jobRole: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "직무를 입력하세요.",
  },
  jobTitle: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "직함을 입력하세요.",
  },
  introduction: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "회원 소개를 입력하세요.",
  },
  remark: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "회원 특이사항을 입력하세요.",
  },
};

export default function AdminMembersCreatePage() {
  const { inputValues, inputErrors, handleInputChange, checkAllInputs } =
    useForm(defaultValues, validationRules);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!checkAllInputs()) return;

    console.log("폼 제출 성공:", inputValues);
    alert("회원이 성공적으로 등록되었습니다.");
  }

  // TODO: 서버로 데이터 전송 로직 추가

  return (
    <InputFormLayout
      title="▹ 회원 등록"
      onSubmit={handleSubmit}
      isLoading={false}
    >
      {/* 회원 생성 페이지 - 회원 유형 선택*/}
      <Box>
        <Flex direction="row" align="center" mb={4}>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#4A5568",
            }}
          >
            회원 유형을 선택하세요
          </span>
          <span
            style={{ color: "red", marginLeft: "4px", marginRight: "24px" }}
          >
            *
          </span>
          <RadioGroup
            value={inputValues.role}
            onValueChange={(e) => handleInputChange("role", e.value)}
          >
            <HStack gap={6}>
              <Radio value="MEMBER">일반 회원</Radio>
              <Radio value="ADMIN">관리자</Radio>
            </HStack>
          </RadioGroup>
        </Flex>
      </Box>
      {/* 업체 생성 페이지 - 업체 정보 입력*/}
      <InputForm
        id="organizationId"
        type="text"
        label="업체 ID"
        placeholder="ex) 123e4567-e89b-12d3-a456-426614174000"
        value={inputValues.organizationId}
        error={inputErrors.organizationId}
        onChange={(e) => handleInputChange("organizationId", e.target.value)}
      />
      <InputForm
        id="name"
        type="text"
        label="성함"
        placeholder="ex) 주농퐉"
        value={inputValues.name}
        error={inputErrors.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
      />
      <InputForm
        id="email"
        type="email"
        label="로그인 Email"
        placeholder="ex) user@example.com"
        value={inputValues.email}
        error={inputErrors.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
      />
      <InputForm
        id="password"
        type="password"
        label="로그인 Password"
        placeholder="ex) 1234"
        value={inputValues.password}
        error={inputErrors.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
      />
      <InputForm
        id="phoneNum"
        type="tel"
        label="연락처"
        placeholder="ex) 010-1234-5678"
        value={inputValues.phoneNum}
        error={inputErrors.phoneNum}
        onChange={(e) => handleInputChange("phoneNum", e.target.value)}
      />
      <InputForm
        id="jobRole"
        type="text"
        label="직무"
        placeholder="ex) 개발자"
        value={inputValues.jobRole}
        error={inputErrors.jobRole}
        onChange={(e) => handleInputChange("jobRole", e.target.value)}
      />
      <InputForm
        id="jobTitle"
        type="text"
        label="직함"
        placeholder="ex) 팀장"
        value={inputValues.jobTitle}
        error={inputErrors.jobTitle}
        onChange={(e) => handleInputChange("jobTitle", e.target.value)}
      />
      <InputForm
        id="introduction"
        type="text"
        label="회원 소개"
        placeholder="회원 소개글을 작성해주세요."
        value={inputValues.introduction}
        error={inputErrors.introduction}
        onChange={(e) => handleInputChange("introduction", e.target.value)}
      />
      <InputForm
        id="remark"
        type="text"
        label="특이사항"
        placeholder="회원 특이사항이 있다면 작성해주세요."
        value={inputValues.remark}
        error={inputErrors.remark}
        onChange={(e) => handleInputChange("remark", e.target.value)}
      />
    </InputFormLayout>
  );
}
