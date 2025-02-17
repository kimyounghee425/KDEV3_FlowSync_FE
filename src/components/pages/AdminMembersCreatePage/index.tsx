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
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1); //  키보드 네비게이션을 위한 상태
  const listRefs = useRef<Array<HTMLDivElement | null>>([]); // 각 리스트 항목을 참조하는 Ref

  // 조직 목록을 가져오는 함수
  const fetchOrganizations = async (searchQuery: string = "") => {
    try {
      const orgData = await getOrganizationsApi();

      // 검색어가 없으면 전체 목록 반환
      if (searchQuery.trim() === "") {
        setOrganizations(orgData.data.dtoList);
        return;
      }

      // 검색어가 있을 경우 필터링된 목록 반환 (대소문자 구분 없이 검색)
      const filteredOrganizations = orgData.data.dtoList.filter(
        (org: OrganizationProps) =>
          org.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setOrganizations(filteredOrganizations);
    } catch (error) {
      console.error("업체 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  //  모달이 열릴 때 조직 목록을 가져옴
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

  //  검색어가 변경될 때 자동으로 검색 실행
  useEffect(() => {
    fetchOrganizations(searchTerm);
    setHighlightedIndex(-1); //  검색어 변경 시 하이라이트 초기화
  }, [searchTerm]);

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

  // 모달 내 검색 입력 필드에서만 Enter 키 허용
  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < organizations.length) {
        handleSelectOrganization(organizations[highlightedIndex].id);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < organizations.length - 1 ? prevIndex + 1 : prevIndex,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex,
      );
    } else if (event.key === "Escape") {
      setIsModalOpen(false);
    }
  }

  //  조직 선택 시 ID와 Name을 함께 설정
  async function handleSelectOrganization(orgId: string) {
    setSelectedOrganizationId(orgId);
    const selectedOrg = organizations.find((org) => org.id === orgId);
    setSelectedOrganizationName(selectedOrg ? selectedOrg.name : ""); // 선택된 조직명 업데이트
    setIsModalOpen(false);
  }

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

  // 유효성 검사
  function validateInputs() {
    if (!checkAllInputs()) {
      alert("입력값을 확인하세요.");
      return false;
    }
    return true;
  }

  // 입력값 공백 다듬기
  function formattedData(input: string) {
    return input.replace(/\s{2,}/g, " ").trim();
  }

  // 등록 버튼 클릭 후 회원 등록 API 호출
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateInputs()) return;
    inputValues.role.trim().replace(/\s{2,}/g, " ");
    inputValues.name.trim().replace(/\s{2,}/g, " ");
    inputValues.jobRole.trim().replace(/\s{2,}/g, " ");
    inputValues.jobTitle.trim().replace(/\s{2,}/g, " ");
    inputValues.introduction.trim().replace(/\s{2,}/g, " ");
    inputValues.remark.trim().replace(/\s{2,}/g, " ");
    try {
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
      alert("회원이 성공적으로 등록되었습니다.");
      route.push("/admin/members");
    } catch (error) {
      alert("회원 등록에 실패했습니다. 다시 시도해주세요.");
    }
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
                        organizations.map((org, index) => (
                          <Box
                            key={org.id}
                            ref={(el: HTMLDivElement | null) =>
                              (listRefs.current[index] = el)
                            }
                            p="3"
                            borderRadius={"md"}
                            bg={highlightedIndex === index ? "blue.500" : ""}
                            color={
                              highlightedIndex === index ? "white" : "black"
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
