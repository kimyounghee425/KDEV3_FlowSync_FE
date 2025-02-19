"use client";

import { useRouter } from "next/navigation";
import { Box, Flex, HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/src/components/ui/radio";
import { useForm } from "@/src/hook/useForm";
import InputForm from "@/src/components/common/InputForm";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import { defaultValuesOfOrganizaion } from "@/src/constants/defaultValues";
import { validationRulesOfOrganization } from "@/src/constants/validationRules";
import { useInputFormatter } from "@/src/hook/useInputFormatter";
import { useValidation } from "@/src/hook/useValidation";
import { useCreateOrganization } from "@/src/hook/useMutationData";

export default function AdminOrganizationsCreatePage() {
  const route = useRouter();
  const { inputValues, inputErrors, handleInputChange, checkAllInputs } =
    useForm(defaultValuesOfOrganizaion, validationRulesOfOrganization);

  const {
    formatPhoneNumber,
    formatBusinessNumber,
    handleFileUpload,
    selectedFile,
  } = useInputFormatter();
  const { validateInputs } = useValidation(checkAllInputs);
  const { mutate: createOrganization, error: OrganizationRegisterError } =
    useCreateOrganization();

  function handleChange(inputName: string, value: string | File) {
    if (inputName === "phoneNumber") {
      handleInputChange(inputName, formatPhoneNumber(value.toString()));
    } else if (inputName === "brNumber") {
      handleInputChange(inputName, formatBusinessNumber(value.toString()));
    } else if (inputName === "businessLicense") {
      if (value instanceof File) handleFileUpload(value);
    } else {
      handleInputChange(inputName, value.toString());
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateInputs(inputValues)) return;

    const organizationData = {
      type: inputValues.type,
      brNumber: inputValues.brNumber,
      name: inputValues.name,
      streetAddress: inputValues.streetAddress,
      detailAddress: inputValues.detailAddress,
      phoneNumber: inputValues.phoneNumber,
    };

    const response = await createOrganization(organizationData, selectedFile);
    // 요청 실패 시 즉시 리턴
    if (response === null) return;

    route.push("/admin/organizations");
  }

  return (
    <InputFormLayout
      title="업체 등록"
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
            value={inputValues.type}
            onValueChange={(e) => handleChange("type", e.value)}
          >
            <HStack gap={6}>
              <Radio value="CUSTOMER">고객사</Radio>
              <Radio value="DEVELOPER">개발사</Radio>
            </HStack>
          </RadioGroup>
        </Flex>
      </Box>
      <Flex gap={4} align="center">
        <Box flex="2">
          <InputForm
            id="name"
            type="text"
            label="업체명"
            placeholder="ex) 비엔시스템"
            value={inputValues.name}
            error={inputErrors.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </Box>
        <Box flex="1">
          <InputForm
            id="phoneNumber"
            type="tel"
            label="대표자 연락처"
            placeholder="ex) 010-1234-5678"
            value={inputValues.phoneNumber}
            error={inputErrors.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </Box>
        <Box flex="1"></Box>
      </Flex>
      <Flex gap={4} align="center">
        <Box flex="1">
          <InputForm
            id="brNumber"
            type="text"
            label="사업자 등록번호"
            placeholder="ex) 123-45-67890"
            value={inputValues.brNumber}
            error={inputErrors.brNumber}
            onChange={(e) => handleChange("brNumber", e.target.value)}
          />
        </Box>
        <Box flex="1">
          <InputForm
            id="businessLicense"
            type="file"
            label="사업자 등록증 첨부"
            placeholder=""
            onChange={(e) =>
              handleChange("businessLicense", e.target.files?.[0] || "")
            }
            isRequired={false} //  `*` 표시 안 함
          />
        </Box>
      </Flex>
      {/* 사업장 주소 조회 및 입력 */}
      <Flex gap={4} align="center">
        <Box flex="1">
          <InputForm
            id="streetAddress"
            type="address"
            label="사업장 도로명 주소"
            placeholder="주소를 검색해주세요."
            value={inputValues.streetAddress}
            error={inputErrors.streetAddress}
            onChange={(e) => handleChange("streetAddress", e.target.value)}
          />
        </Box>
        {/* 사업장 주소 상세 입력 */}
        <Box flex="1">
          <InputForm
            id="detailAddress"
            type="text"
            label="사업장 상세 주소"
            placeholder="ex) 역삼동"
            value={inputValues.detailAddress}
            error={inputErrors.detailAddress}
            onChange={(e) => handleChange("detailAddress", e.target.value)}
          />
        </Box>
      </Flex>
    </InputFormLayout>
  );
}
