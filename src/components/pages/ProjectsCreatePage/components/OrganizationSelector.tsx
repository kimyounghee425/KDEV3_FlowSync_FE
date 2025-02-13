"use client";

import React, { useState, useRef, useEffect } from "react";
import { Flex, Box, Text, Button, Input } from "@chakra-ui/react";
import { MemberProps, OrganizationProps } from "@/src/types";
import { getOrganizationsApi } from "@/src/api/getOrganization";
import { fetchMembersWithinOrgApi } from "@/src/api/members";

interface OrganizationSelectorProps {
  title: string;
  organizationType: string; // "CUSTOMER" | "DEVELOPER";
  selectedOrganizationId: string;
  setSelectedOrganizationId: (id: string) => void;
  selectedOrganizationName: string;
  setSelectedOrganizationName: (name: string) => void;
  selectedMembers: MemberProps[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<MemberProps[]>>;
  ownerId: string;
  setOwnerId: (id: string) => void;
}

export default function OrganizationSelector({
  title,
  organizationType,
  selectedOrganizationId,
  setSelectedOrganizationId,
  selectedOrganizationName,
  setSelectedOrganizationName,
  selectedMembers,
  setSelectedMembers,
  ownerId,
  setOwnerId,
}: OrganizationSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [organizations, setOrganizations] = useState<OrganizationProps[]>([]);
  const [members, setMembers] = useState<MemberProps[]>([]);

  // ✅ 특정 조직의 멤버를 가져오는 함수
  const fetchOrganizationMembers = async (organizationId: string) => {
    if (!organizationId) {
      setMembers([]);
      return;
    }
    try {
      const response = await fetchMembersWithinOrgApi(organizationId);
      setMembers(response.data.members || []);
    } catch (error) {
      console.error("멤버 데이터를 가져오는 중 오류 발생:", error);
      setMembers([]);
    }
  };

  // ✅ 조직 목록을 가져오는 함수
  const fetchOrganizations = async () => {
    try {
      const orgData = await getOrganizationsApi(organizationType, "ACTIVE");
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
  }, [isModalOpen, organizationType]);

  // ✅ 프로젝트 수정 시 기존 `selectedMembers` 유지 (멤버 목록이 변경될 때만 업데이트)
  useEffect(() => {
    if (selectedOrganizationId) {
      fetchOrganizationMembers(selectedOrganizationId);
    }
  }, [selectedOrganizationId]);

  // ✅ 조직 선택 시 ID와 Name을 함께 설정
  const handleSelectOrganization = async (orgId: string) => {
    setSelectedOrganizationId(orgId);
    const selectedOrg = organizations.find((org) => org.id === orgId);
    setSelectedOrganizationName(selectedOrg ? selectedOrg.name : ""); // 선택된 조직명 업데이트

    // ✅ 멤버 목록을 가져오지만, 자동으로 `setSelectedMembers`를 업데이트하지 않음
    await fetchOrganizationMembers(orgId);
  };

  // 멤버 선택/해제 로직
  const handleSelectMember = (member: MemberProps) => {
    setSelectedMembers((prev) => {
      const isAlreadySelected = prev.some((m) => m.id === member.id);
      if (isAlreadySelected) {
        if (ownerId === member.id) {
          setOwnerId(""); // 오너 해제
        }
        return prev.filter((m) => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  // Owner 설정 로직
  const handleSetOwner = (member: MemberProps) => {
    setOwnerId(member.id);
    if (!selectedMembers.some((m) => m.id === member.id)) {
      setSelectedMembers((prev) => [...prev, member]); // Owner 로 지정된 멤버가 선택되지 않았다면 추가
    }
  };

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

  return (
    <Flex
      direction="column"
      gap="1rem"
      width="100%"
      padding="0.5rem 1rem 0 1rem"
      fontSize="1rem"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        width="100%"
        maxWidth="80rem"
        gap={4}
        alignItems="stretch"
      >
        {/* 입력창 (고객사/개발사를 선택하세요) */}
        <Box flex="1" display="flex" flexDirection="column">
          <Text fontWeight="bold" mb="0.5rem">
            {title}
          </Text>
          <Input
            fontSize="0.9rem"
            placeholder="회사를 검색하세요"
            onClick={() => setIsModalOpen(true)}
            readOnly
            value={selectedOrganizationName} // ✅ 조직명 표시
            cursor="pointer"
            border="1px solid #ccc"
            borderRadius="0.5rem"
            p="0.75rem"
            width="100%"
            height="5rem"
          />
        </Box>

        {/* 입력창 (멤버 목록) */}
        <Box flex="4" display="flex" flexDirection="column">
          <Text fontWeight="bold" mb="0.5rem">
            담당자 회원 배정
          </Text>
          <Box
            border="1px solid #ccc"
            borderRadius="0.5rem"
            p="0.5rem"
            maxHeight="15rem"
            overflowY="auto"
            height="5rem"
            display="flex"
            flexWrap="wrap" // 여러 줄로 정렬 가능하게 설정
            gap="0.5rem" // 공백 추가 (회원들 사이 간격 조절)
          >
            {selectedMembers.length > 0 ? (
              selectedMembers.map((member) => {
                const isOwner = ownerId === member.id;
                return (
                  <Box
                    key={member.id}
                    p="0.5rem"
                    width="6rem"
                    minWidth="6rem"
                    maxWidth="8rem"
                    maxHeight="4rem"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    borderRadius="md"
                    bg={
                      selectedMembers.some((m) => m.id === member.id)
                        ? "blue.500"
                        : "white"
                    }
                    color={
                      selectedMembers.some((m) => m.id === member.id)
                        ? "white"
                        : "black"
                    }
                    cursor="pointer"
                    mr="0.25rem" // ✅ 간격 줄임
                    _hover={{ bg: "blue.200", color: "white" }}
                    onClick={() => {
                      if (isOwner) {
                        setOwnerId("");
                      } else {
                        setSelectedMembers((prev) =>
                          prev.some((m) => m.id === member.id)
                            ? prev.filter((m) => m.id !== member.id)
                            : [...prev, member],
                        );
                      }
                    }}
                  >
                    <Text
                      fontWeight="bold"
                      fontSize="0.8rem"
                      maxWidth="5rem"
                      truncate
                    >
                      {member.name} {isOwner && "👑 "}
                    </Text>
                    <Text fontSize="0.6rem" maxWidth="5rem" truncate>
                      {member.role}
                    </Text>
                    <Text fontSize="0.6rem" maxWidth="5rem" truncate>
                      ({member.jobRole})
                    </Text>
                  </Box>
                );
              })
            ) : (
              <Text fontSize="0.9rem" color="gray.500">
                선택된 회사의 멤버가 없습니다.
              </Text>
            )}
          </Box>
        </Box>
      </Flex>

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
          // justifyContent="center" // ✅ 내용을 중앙 정렬
          // alignItems="center"
          overflowY="auto" // ✅ 내부 콘텐츠가 많아지면 스크롤 활성화
        >
          <Box>
            <Flex direction={{ base: "column", md: "row" }} gap="1rem">
              {/* 고객사/개발사 목록 */}
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
                  {organizations.length > 0 ? (
                    organizations
                      .filter((org) =>
                        org.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                      )
                      .map((org) => (
                        <Box
                          key={org.id}
                          p="0.75rem"
                          borderRadius="md"
                          bg={
                            selectedOrganizationId === org.id
                              ? "blue.500"
                              : "white"
                          }
                          color={
                            selectedOrganizationId === org.id
                              ? "white"
                              : "black"
                          }
                          cursor="pointer"
                          mb="0.5rem"
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
              </Box>

              {/* 모달창 우측 회원 목록 */}
              <Box flex="1">
                <Text fontWeight="bold" mb="0.5rem">
                  멤버 선택
                </Text>

                <Box
                  position="absolute"
                  top="40px" // 버튼 아래에 위치
                  left="0"
                  width="200px"
                  bg="white"
                  border="1px solid #ccc"
                  borderRadius="8px"
                  boxShadow="md"
                  p="4"
                  zIndex="9999"
                >
                  <Text fontWeight="bold">Owner 란?</Text>
                  <Text fontSize="sm" mt="2">
                    {title === "고객사 목록"
                      ? "고객사 멤버 중 Owner 로 정해진 사람은 결재 권한이 있습니다."
                      : "개발사 멤버 중 Owner 로 정해진 사람은 결재 요청 권한이 있습니다"}
                  </Text>
                </Box>

                <Box
                  border="1px solid #ccc"
                  borderRadius="0.5rem"
                  p="0.75rem"
                  maxHeight="20rem"
                  overflowY="auto"
                >
                  {members.length > 0 ? (
                    members.map((member) => {
                      const isSelected = selectedMembers.some(
                        (m) => m.id === member.id,
                      );
                      const isOwner = ownerId === member.id;
                      return (
                        <Box
                          key={member.id}
                          p="0.5rem"
                          borderRadius="md"
                          bg={isSelected ? "blue.500" : "white"}
                          color={isSelected ? "white" : "black"}
                          cursor="pointer"
                          mb="0.5rem"
                          _hover={{ bg: "blue.200", color: "white" }}
                          onClick={() => handleSelectMember(member)}
                        >
                          <Text>
                            {isOwner && "👑 "} {member.name} - {member.jobRole}
                          </Text>
                          <Button
                            size="xs"
                            mt="0.5rem"
                            colorScheme={isOwner ? "blue" : "gray"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetOwner(member);
                            }}
                          >
                            {isOwner ? "👑 Owner" : "Set as Owner"}
                          </Button>
                        </Box>
                      );
                    })
                  ) : (
                    <Text fontSize="0.9rem" color="gray.500">
                      선택된 회사의 멤버가 없습니다.
                    </Text>
                  )}
                </Box>
              </Box>
            </Flex>

            <Button
              mt="1rem"
              width="100%"
              colorScheme="blue"
              onClick={() => setIsModalOpen(false)}
            >
              저장
            </Button>
          </Box>
        </Box>
      )}
    </Flex>
  );
}
