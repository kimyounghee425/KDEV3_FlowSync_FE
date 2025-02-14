"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Flex, HStack, Input, Text } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/src/components/ui/radio";
import { useForm } from "@/src/hook/useForm";
import InputForm from "@/src/components/common/InputForm";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import { defaultValuesOfMember } from "@/src/constants/defaultValues";
import { validationRulesOfCreatingMember } from "@/src/constants/validationRules";
import { createMember } from "@/src/api/members";
import { getOrganizationsApi } from "@/src/api/getOrganization";
import SelectedOrganization from "@/src/components/pages/AdminMembersCreatePage/components/SelectOrganization";
import { OrganizationProps } from "@/src/types";

export default function AdminMembersCreatePage() {
  const route = useRouter();
  const { inputValues, inputErrors, handleInputChange, checkAllInputs } =
    useForm(defaultValuesOfMember, validationRulesOfCreatingMember);

  // 업체 관련 정보
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [organizations, setOrganizations] = useState<OrganizationProps[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<OrganizationProps>();
  const [selectedOrganizationId, setSelectedOrganizationId] =
    useState<string>("");
  const [selectedOrganizationName, setSelectedOrganizationName] =
    useState<string>("");

  // ✅ 조직 목록을 가져오는 함수
  const fetchOrganizations = async () => {
    try {
      const orgData = await getOrganizationsApi();
      console.log("페칭출력", orgData.data.dtoList);
      setOrganizations(orgData.data.dtoList);
    } catch (error) {
      console.error("업체 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // ✅ 모달이 열릴 때 조직 목록을 가져옴
  useEffect(() => {
    if (isModalOpen && organizations.length === 0) {
      fetchOrganizations();
    }
  }, [isModalOpen]);

  // 외부 클릭 시 모달 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ 조직 선택 시 ID와 Name을 함께 설정
  const handleSelectOrganization = async (orgId: string) => {
    setSelectedOrganizationId(orgId);
    const selectedOrg = organizations.find((org) => org.id === orgId);
    setSelectedOrganizationName(selectedOrg ? selectedOrg.name : ""); // 선택된 조직명 업데이트
    setIsModalOpen(false);
  };

  function handleChange(inputName: string, value: string) {
    if (inputName === "phoneNum") {
      const onlyNumbers = value
        .toString()
        .replace(/[^0-9]/g, "")
        .slice(0, 11);

      let formattedValue = onlyNumbers;

      if (onlyNumbers.length > 3 && onlyNumbers.length <= 7) {
        formattedValue = `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
      } else if (onlyNumbers.length > 7) {
        formattedValue = `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
      }

      handleInputChange(inputName, formattedValue);
    } else {
      handleInputChange(inputName, value);
    }
  }

  function validateInputs() {
    if (!checkAllInputs()) {
      alert("입력값을 확인하세요.");
      return false;
    }
    return true;
  }
  // console.log(
  //   inputValues.role,
  //   inputValues.organizationId,
  //   inputValues.name,
  //   inputValues.email,
  //   inputValues.password,
  //   inputValues.phoneNum,
  //   inputValues.jobRole,
  //   inputValues.jobTitle,
  //   inputValues.introduction,
  //   inputValues.remark,
  // );

  // 입력값 공백 다듬기
  const formattedData = (input: string) => {
    return input.replace(/\s{2,}/g, " ").trim();
  }
  


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateInputs()) return;
    try {
      console.log(
        "업체 정보 확인 -  String(selectedOrganization?.id) ",
        String(selectedOrganization?.id),
      );
      const response = await createMember(
        formattedData(inputValues.role),
        selectedOrganizationId,
        formattedData(inputValues.name),
        inputValues.email,
        inputValues.password,
        inputValues.phoneNum,
        formattedData(inputValues.jobRole),
        formattedData(inputValues.jobTitle),
        formattedData(inputValues.introduction),
        formattedData(inputValues.remark),
      );

      // 회원 등록 API(2) - 파일 업로드 O
      // const file = null; // 파일이 있을 경우에만 처리
      // const response = await createMemberWithFile(memberData, file);

      console.log("회원 등록 성공 - response: ", response);
      alert("회원이 성공적으로 등록되었습니다.");
      route.push("/admin/members");
    } catch (error) {
      console.error("회원 등록 중 오류 발생:", error);
      alert("회원 등록에 실패했습니다. 다시 시도해주세요.");
    }
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === " ") {
      e.preventDefault(); // ✅ 스페이스바 입력 차단
    }
  };

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
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#4A5568",
            }}
          >
            회원 유형을 선택하세요
          </span>
          <span
            style={{
              color: "red",
              marginLeft: "0.5rem",
              marginRight: "1.5rem",
            }}
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
      {/* 회원 생성 페이지 - 회원 정보 입력*/}

      <Flex
        direction="row"
        width="100%"
        alignItems="stretch"
        gap="1rem"
        align="center"
      >
        <Box flex="1">
          <InputForm
            id="name"
            type="text"
            label="성함"
            placeholder="ex) 성함을 입력하세요."
            value={inputValues.name}
            error={inputErrors.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </Box>
        {/* 입력창 (고객사/개발사를 선택하세요) */}
        <Box flex="1" display="flex" flexDirection="column">
          <Flex>
            <Text fontWeight="bold" mb="0.5rem">
              소속 업체
            </Text>
            <span style={{ color: "red", marginLeft: "0.3rem" }}> *</span>
          </Flex>
          <Input
            fontSize="1rem"
            placeholder="업체를 검색하세요."
            onClick={() => setIsModalOpen(true)}
            readOnly
            value={selectedOrganizationName} // ✅ 조직명 표시
            cursor="pointer"
            border="1px solid var(--input-border, #6c757d) !important" /* ⚡강제 적용 */
            borderRadius="0.5rem"
            padding="0.8rem"
            width="100%"
            height="3.2rem"
          />
        </Box>
        {/* 모달 */}
        {isModalOpen && (
          <Box
            ref={modalRef}
            position="fixed" // 화면 전체 기준 중앙 정렬
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="60rem" // 크기 고정
            minHeight="30rem" // ✅ 최소 높이 고정 (멤버 없을 때도 레이아웃 유지)
            height="40rem"
            bg="white"
            borderRadius="0.5rem"
            boxShadow="lg"
            p="1.5rem"
            zIndex="999"
            display="flex"
            flexDirection="column"
            overflowY="auto" // ✅ 내부 콘텐츠가 많아지면 스크롤 활성화
          >
            <Box>
              <Flex direction="column" gap="1rem">
                {/* 업체 전체 목록 */}
                <Box flex="1">
                  <Text fontWeight="bold" mb="0.5rem">
                    업체 목록
                  </Text>
                  <Input
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    border="1px solid #ccc"
                    borderRadius="0.5rem"
                    p="0.75rem"
                    mb="1rem"
                    width="100%"
                  />
                  <Box maxHeight="20rem" overflowY="auto">
                    {organizations?.length > 0 ? (
                      organizations.map((org) => (
                        <Box
                          key={org.id}
                          p="3"
                          borderRadius={"md"}
                          bg={selectedOrganization === org ? "blue.500" : ""}
                          color={
                            selectedOrganization === org ? "white" : "black"
                          }
                          cursor="pointer"
                          mb="2"
                          _hover={{ bg: "blue.200", color: "white" }}
                          onClick={() => handleSelectOrganization(org.id)}
                        >
                          <Text>{org.name}</Text>
                        </Box>
                      ))
                    ) : (
                      <Text>조회된 회사가 없습니다.</Text>
                    )}
                  </Box>
                  <Button
                    mt="1rem"
                    width="100%"
                    colorScheme="blue"
                    onClick={() => setIsModalOpen(false)}
                  >
                    저장
                  </Button>
                </Box>
              </Flex>
            </Box>
          </Box>
        )}
      </Flex>

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
        onChange={(e) => handleChange("phoneNum", e.target.value)}
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
