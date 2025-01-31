"use client";

import { useRouter } from "next/navigation";
import { Box, Flex, HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/src/components/ui/radio";
import { useForm } from "@/src/hook/useForm";
import InputForm from "@/src/components/common/InputForm";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import { defaultValuesOfOrganizaion } from "@/src/constants/defaultValues";
import { validationRulesOfCreatingOrganization } from "@/src/constants/validationRules";
import { createOrganization } from "@/src/api/organizations";
import { useState } from "react";

export default function AdminOrganizationsCreatePage() {
  const route = useRouter();
  const { inputValues, inputErrors, handleInputChange, checkAllInputs } =
    useForm(defaultValuesOfOrganizaion, validationRulesOfCreatingOrganization);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function validateInputs() {
    if (!checkAllInputs()) {
      console.log("입력값 확인요청");
      alert("입력값을 확인하세요.");
      return false;
    }
    return true;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      const organizationData = {
        type: inputValues.type,
        brNumber: inputValues.brNumber,
        name: inputValues.name,
        streetAddress: inputValues.streetAddress,
        detailAddress: inputValues.detailAddress,
        phoneNumber: inputValues.phoneNumber,
      };

      const response = await createOrganization(organizationData, selectedFile);
      console.log("업체 등록 성공 - response: ", response);
      alert("업체가 성공적으로 등록되었습니다.");
      route.push("/admin/organizations");
    } catch (error) {
      console.error("업체 등록 중 오류 발생:", error);
      alert("업체 등록에 실패했습니다. 다시 시도해주세요.");
    }
  }

  return (
    <InputFormLayout
      title="▹ 업체 등록"
      onSubmit={handleSubmit}
      isLoading={false}
    >
      {/* #TODO 화면 렌더링 시 '업체 타입' 기본값으로 '개발사' 선택되어져야 함  */}
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
            value={inputValues.type}
            onValueChange={(e) => handleInputChange("type", e.value)}
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
      <Flex gap={4} align="center">
        <Box flex="1">
          <InputForm
            id="brNumber"
            type="text"
            label="사업자 등록번호"
            placeholder="ex) 123-45-67890"
            value={inputValues.brNumber}
            error={inputErrors.brNumber}
            onChange={(e) => handleInputChange("brNumber", e.target.value)}
          />
        </Box>
        <Box flex="1">
          <InputForm
            id="businessLicense"
            type="file"
            label="사업자 등록증 첨부"
            placeholder=""
            onChange={(e) => handleFileChange(e)}
          />
        </Box>
      </Flex>
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
