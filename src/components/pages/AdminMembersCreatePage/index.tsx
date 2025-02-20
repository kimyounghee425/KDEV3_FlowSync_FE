"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Flex, HStack, Input, Text } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/src/components/ui/radio";
import { useForm } from "@/src/hook/useForm";
import InputForm from "@/src/components/common/InputForm";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import { defaultValuesOfMember } from "@/src/constants/defaultValues";
import { validationRulesOfCreatingMember } from "@/src/constants/validationRules";
import { CreateMemberInput } from "@/src/types";
import { useInputFormatter } from "@/src/hook/useInputFormatter";
import { useOrganizationSearch } from "@/src/hook/useOrganizationSearch";
import { useCreateMember } from "@/src/hook/useMutationData";
import { useValidation } from "@/src/hook/useValidation";

export default function AdminMembersCreatePage() {
  const route = useRouter();
  // useForm 훅으로 입력값 및 유효성 검사 관리
  const { inputValues, inputErrors, handleInputChange, checkAllInputs } =
    useForm(defaultValuesOfMember, validationRulesOfCreatingMember);
  // 전화번호 및 기타 입력값 포맷팅 (useInputFormatter 활용)
  const { validateInputs } = useValidation(checkAllInputs);
  const { formatPhoneNumber, trimWhitespace } = useInputFormatter();

  // 업체 관련 정보
  // 조직 검색 및 선택 기능 (useOrganizationSearch 활용)
  const {
    isModalOpen,
    searchTerm,
    organizations,
    selectedOrganizationId,
    selectedOrganizationName,
    highlightedIndex,
    listRefs,
    modalRef,
    setSearchTerm,
    setIsModalOpen,
    handleSelectOrganization,
    handleSearchKeyDown,
  } = useOrganizationSearch();

  const { mutate: createMember, error: MemberRegisterError } =
    useCreateMember();

  useEffect(() => {
    // 현재 선택된 항목이 화면에 표시되도록 스크롤 조정
    if (highlightedIndex >= 0 && listRefs.current[highlightedIndex]) {
      listRefs.current[highlightedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  // Enter 키 입력 시 기본 submit 작동 방지
  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (isModalOpen) return; // 모달이 열려 있으면 Enter 허용
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 제출 방지
    }
  }
  // 입력 변경 핸들러 (전화번호 포맷 적용)
  function handleChange(inputName: string, value: string) {
    if (inputName === "phoneNum") {
      handleInputChange(inputName, formatPhoneNumber(value));
    } else {
      handleInputChange(inputName, value);
    }
  }
  // 회원 생성 요청
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateInputs(inputValues)) return;

    // `CreateMemberInput` 타입을 가진 객체 생성
    const newMember: CreateMemberInput = {
      role: inputValues.role,
      organizationId: selectedOrganizationId,
      name: trimWhitespace(inputValues.name),
      email: trimWhitespace(inputValues.email),
      password: trimWhitespace(inputValues.password),
      phoneNum: inputValues.phoneNum,
      jobRole: trimWhitespace(inputValues.jobRole),
      jobTitle: trimWhitespace(inputValues.jobTitle),
      introduction: trimWhitespace(inputValues.introduction),
      remark: trimWhitespace(inputValues.remark),
    };

    const response = await createMember(newMember); // API 호출

    if (response === null) return;

    route.push("/admin/members"); // 성공 시 이동
  }

  return (
    <InputFormLayout
      title="회원 등록"
      onSubmit={handleSubmit}
      isLoading={false}
    >
      <form onKeyDown={handleFormKeyDown}>
        {/* 회원 생성 페이지 - 회원 유형 선택*/}
        <Box>
          <Flex direction="row" align="center" mb={4}>
            <Box>
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
            </Box>
            <Box>
              <RadioGroup
                value={inputValues.role}
                defaultValue="MEMBER"
                onValueChange={(e) => handleInputChange("role", e.value)}
              >
                <HStack gap={6}>
                  <Radio value="MEMBER">일반 회원</Radio>
                  <Radio value="ADMIN">관리자</Radio>
                </HStack>
              </RadioGroup>
            </Box>
          </Flex>
        </Box>

        <Flex direction="row" width="100%" alignItems="stretch" gap="1rem">
          {/* 회원명 입력 */}
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
          {/* 고객사/개발사 선택 모달 */}
          <Box flex="1" display="flex" flexDirection="column">
            <Flex>
              <Text fontWeight="bold" mb="0.7rem">
                소속 업체
              </Text>
              <span style={{ color: "red", marginLeft: "0.3rem" }}> *</span>
            </Flex>
            <Input
              fontSize="1rem"
              placeholder="업체를 검색하세요."
              onClick={() => setIsModalOpen(true)}
              readOnly
              value={selectedOrganizationName} //  조직명 표시
              cursor="pointer"
              border="1px solid var(--input-border, #6c757d) !important" /* ⚡강제 적용 */
              borderRadius="0.5rem"
              width="100%"
              height="3.2rem"
            />
          </Box>
          {/* 모달 OPEN 시 */}
          {isModalOpen && (
            <Box
              ref={modalRef}
              position="fixed" // 화면 전체 기준 중앙 정렬
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width="40rem" // 크기 고정
              minHeight="20rem" //  최소 높이 고정 (멤버 없을 때도 레이아웃 유지)
              height="30rem"
              bg="white"
              borderRadius="0.5rem"
              boxShadow="lg"
              p="1.5rem"
              zIndex="999"
              display="flex"
              flexDirection="column" // 버튼이 항상 하단으로 가도록 설정z
              justifyContent="space-between"
              overflowY="auto" //  내부 콘텐츠가 많아지면 스크롤 활성화
            >
              <Box flex="1" overflowY="hidden">
                <Flex direction="column" gap="1rem">
                  {/* 업체 전체 목록 */}
                  <Box flex="1">
                    <Text fontWeight="bold" mb="0.5rem">
                      소속 업체 검색
                    </Text>
                    <Input
                      placeholder="검색어를 입력하세요"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleSearchKeyDown} // Enter 키 누를 경우 기본 submit 동작 방지
                      border="1px solid #ccc"
                      borderRadius="0.5rem"
                      p="0.75rem"
                      mb="1rem"
                      width="100%"
                    />
                    <Box maxHeight="15rem" overflowY="auto">
                      {organizations?.length > 0 ? (
                        organizations.map(
                          (org, index) =>
                            org.status === "ACTIVE" && (
                              <Box
                                key={org.id}
                                ref={(el: HTMLDivElement | null) =>
                                  (listRefs.current[index] = el)
                                }
                                p="3"
                                borderRadius={"md"}
                                bg={
                                  highlightedIndex === index ? "blue.500" : ""
                                }
                                color={
                                  highlightedIndex === index ? "white" : "black"
                                }
                                cursor="pointer"
                                mb="2"
                                _hover={{ bg: "blue.200", color: "white" }}
                                onClick={() => handleSelectOrganization(org.id)}
                              >
                                <Text>
                                  {org.name}
                                  &nbsp;
                                  {org.type === "CUSTOMER"
                                    ? "(고객사)"
                                    : "(개발사)"}
                                </Text>
                              </Box>
                            ),
                        )
                      ) : (
                        <Text>조회된 회사가 없습니다.</Text>
                      )}
                    </Box>
                    <Box mt="auto" pt="1rem">
                      <Button
                        width="100%"
                        backgroundColor="blue.500"
                        color="white"
                        _hover={{ backgroundColor: "blue.600" }}
                        onClick={() => setIsModalOpen(false)}
                      >
                        저장
                      </Button>
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Box>
          )}
        </Flex>
        <Flex direction="row" width="100%" alignItems="stretch" gap="1rem">
          <Box flex="1">
            {/* 로그인 이메일 입력 */}
            <InputForm
              id="email"
              type="email"
              label="로그인 Email"
              placeholder="ex) user@example.com"
              value={inputValues.email}
              error={inputErrors.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </Box>
          <Box flex="1">
            {/* 로그인 패스워드 입력 */}
            <InputForm
              id="password"
              type="password"
              label="로그인 Password"
              placeholder="ex) 1234"
              value={inputValues.password}
              error={inputErrors.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
          </Box>
        </Flex>
        {/* 연락처, 직무, 직함 */}
        <Flex gap={4} align="center">
          <Box flex="2">
            <InputForm
              id="phoneNum"
              type="tel"
              label="연락처"
              placeholder="ex) 010-1234-5678"
              value={inputValues.phoneNum}
              error={inputErrors.phoneNum}
              onChange={(e) => handleChange("phoneNum", e.target.value)}
            />{" "}
          </Box>

          <Box flex="2">
            {/* 직무 입력 */}
            <InputForm
              id="jobRole"
              type="text"
              label="직무"
              placeholder="ex) 개발자"
              value={inputValues.jobRole}
              error={inputErrors.jobRole}
              onChange={(e) => handleInputChange("jobRole", e.target.value)}
            />{" "}
          </Box>
          <Box flex="1">
            {/* 직함 입력 */}
            <InputForm
              id="jobTitle"
              type="text"
              label="직함"
              placeholder="ex) 팀장"
              value={inputValues.jobTitle}
              error={inputErrors.jobTitle}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            />
          </Box>
        </Flex>
        {/*회원 소개, 특이사항 */}
        <Flex gap={4} align="center">
          <Box flex="1">
            <InputForm
              id="introduction"
              type="text"
              label="회원 소개"
              placeholder="회원 소개글을 작성해주세요."
              value={inputValues.introduction}
              error={inputErrors.introduction}
              onChange={(e) =>
                handleInputChange("introduction", e.target.value)
              }
            />{" "}
          </Box>
          <Box flex="1">
            {/* 회원 특이사항 입력 */}
            <InputForm
              id="remark"
              type="text"
              label="특이사항"
              placeholder="회원 특이사항이 있다면 작성해주세요."
              value={inputValues.remark}
              error={inputErrors.remark}
              onChange={(e) => handleInputChange("remark", e.target.value)}
            />
          </Box>
        </Flex>
      </form>
    </InputFormLayout>
  );
}
