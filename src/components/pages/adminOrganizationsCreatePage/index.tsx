"use client";

import { useForm } from "@/src/hook/useForm";
import InputForm from "@/src/components/common/InputForm";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import { Box, Flex, HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/src/components/ui/radio";

// 초기 입력값 세팅
const defaultValues = {
  name: "",
  brNumber: "",
  brCertificateUrl: "https://", // <input> url 타입 기본 속성은 https:// 를 입력해야 돼서 초기값으로 세팅
  streetAddress: "",
  detailAddress: "",
  phoneNumber: "",
  orgType: "CUSTOMER", // radio 버튼
};

// 입력값에 대한 검증 규칙
const validationRules = {
  name: {
    isValid: (value: string) => value.trim() !== "", // trim(): value에서 공백이 모두 제거된 값을 반환
    errorMessage: "업체명을 입력하세요.",
  },
  brNumber: {
    isValid: (value: string) => /^\d{3}-\d{2}-\d{5}$/.test(value),
    errorMessage: "올바른 사업자 등록번호를 입력하세요.",
  },
  brCertificateUrl: {
    isValid: (value: string) => /^https?:\/\/.+\..+$/.test(value),
    errorMessage: "올바른 회사 URL을 입력하세요.",
  },
  streetAddress: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "사업장 도로명 주소를 입력하세요.",
  },
  detailAddress: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "사업장 상세 주소를 입력하세요.",
  },
  phoneNumber: {
    isValid: (value: string) => /^\d{3}-\d{4}-\d{4}$/.test(value),
    errorMessage: "올바른 전화번호를 입력하세요.",
  },
  orgType: {
    isValid: (value: string) => ["CUSTOMER", "DEVELOPER"].includes(value),
    errorMessage: "업체 유형을 선택하세요.",
  },
};

export default function AdminOrganizationsCreatePage() {
  const { inputValues, inputErrors, handleInputChange, checkAllInputs } =
    useForm(defaultValues, validationRules);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!checkAllInputs()) return;

    console.log("폼 제출 성공:", inputValues);
    alert("업체가 성공적으로 생성되었습니다.");
  }

  // TODO: 서버로 데이터 전송 로직 추가

  return (
    <InputFormLayout
      title="▹ 업체 생성"
      onSubmit={handleSubmit}
      isLoading={false}
    >
      {/* 업체 생성 페이지 - 업체 유형 선택*/}
      <Box>
        <Flex direction="row" align="center" mb={4}>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#4A5568",
            }}
          >
            업체 유형을 선택하세요
          </span>
          <span
            style={{ color: "red", marginLeft: "4px", marginRight: "24px" }}
          >
            *
          </span>
          <RadioGroup
            value={inputValues.orgType}
            onValueChange={(e) => handleInputChange("orgType", e.value)}
          >
            <HStack gap={6}>
              <Radio value="CUSTOMER">고객사</Radio>
              <Radio value="DEVELOPER">개발사</Radio>
            </HStack>
          </RadioGroup>
        </Flex>
      </Box>
      {/* 업체 생성 페이지 - 업체 정보 입력*/}
      <InputForm
        id="name"
        type="text"
        label="업체명"
        placeholder="ex) 비엔시스템"
        value={inputValues.name}
        error={inputErrors.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
      />
      <InputForm
        id="brNumber"
        type="text"
        label="사업자 등록번호"
        placeholder="ex) 123-45-67890"
        value={inputValues.brNumber}
        error={inputErrors.brNumber}
        onChange={(e) => handleInputChange("brNumber", e.target.value)}
      />
      <InputForm
        id="brCertificateUrl"
        type="text"
        label="회사 URL"
        placeholder="ex) https://www.example.com"
        value={inputValues.brCertificateUrl}
        error={inputErrors.brCertificateUrl}
        onChange={(e) => handleInputChange("brCertificateUrl", e.target.value)}
      />
      <InputForm
        id="streetAddress"
        type="text"
        label="사업장 도로명 주소"
        placeholder="ex) 서울시 강남구"
        value={inputValues.streetAddress}
        error={inputErrors.streetAddress}
        onChange={(e) => handleInputChange("streetAddress", e.target.value)}
      />
      <InputForm
        id="detailAddress"
        type="text"
        label="사업장 상세 주소"
        placeholder="ex) 역삼동"
        value={inputValues.detailAddress}
        error={inputErrors.detailAddress}
        onChange={(e) => handleInputChange("detailAddress", e.target.value)}
      />
      <InputForm
        id="phoneNumber"
        type="tel"
        label="대표자 연락처"
        placeholder="ex) 010-1234-5678"
        value={inputValues.phoneNumber}
        error={inputErrors.phoneNumber}
        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
      />
    </InputFormLayout>
  );
}
