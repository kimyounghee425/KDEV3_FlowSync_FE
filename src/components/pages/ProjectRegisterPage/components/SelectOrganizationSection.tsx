// 회사와 멤버 모두 선택하는 컴포넌트

import { Flex, Box, Text, Button } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { useState, useRef, useEffect } from "react";

interface OrgProps {
  id: number;
  type: string;
  brNumber: string;
  name: string;
  brCertificateUrl: string;
  streetAddress: string;
  detailAddress: string;
  phoneNumber: string;
  status: string;
}

interface Member {
  id: number;
  organizationId: number;
  organizationName: string;
  role: string;
  status: string;
  email: string;
  name: string;
  phoneNum: string;
  jobRole: string;
  regAt: string;
  introduction: string;
  remark: string;
}

interface CustomerOrgProps {
  title: string;
  organizations: OrgProps[];
  selectedOrgId: number;
  setSelectedOrgId: (id: number) => void;
  orgMembers: Member[];
  selectedMembers: Member[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  ownerMember?: Member;
  setOwnerMember?: React.Dispatch<React.SetStateAction<Member | undefined>>;
}

export default function SelectOrganizationSection({
  title,
  organizations,
  selectedOrgId,
  setSelectedOrgId,
  orgMembers,
  selectedMembers,
  setSelectedMembers,
  ownerMember,
  setOwnerMember,
}: CustomerOrgProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // 멤버 클릭했을 때 해제하는 멤버가 오너면 오너도 해제
  const handleSelectMember = (member: Member) => {
    setSelectedMembers((prev) => {
      const isAlreadySelected = prev.some((m) => m.id === member.id);
      if (isAlreadySelected) {
        // 선택한게 오너
        if (ownerMember?.id === member.id && setOwnerMember) {
          setOwnerMember(undefined);
        }
        return prev.filter((m) => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // ✅ 마우스 클릭 이벤트 감지
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // console.log(devOwnerMember)
  // console.log(selectedMembers)

  return (
    <Flex direction={"column"} alignItems="center" width="100%">
      {/* 위쪽 박스들 (고객사, 멤버 목록) */}
      <Flex direction={"row"} justifyContent="space-between" width="80%">
        {/* 고객사 */}
        <Flex minWidth={"700px"}>
          <Flex direction={"column"} mr={5} mb={8}>
            <Box mt={8} mb={4}>
              <Text lineHeight={"2"}>{title}</Text>
            </Box>
            <Box
              h={"400px"}
              w={"250px"}
              overflowY={"auto"}
              border="1px solid #ccc"
              borderRadius="8px"
              p="4"
            >
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <Box
                    key={org.id}
                    p="3"
                    borderRadius={"md"}
                    bg={selectedOrgId === org.id ? "blue.500" : ""}
                    color={selectedOrgId === org.id ? "white" : "black"}
                    cursor="pointer"
                    mb="2"
                    _hover={{ bg: "blue.200", color: "white" }}
                    onClick={() => setSelectedOrgId(org.id)}
                  >
                    <Text>{org.name}</Text>
                  </Box>
                ))
              ) : (
                <Text>조회된 회사가 없습니다.</Text>
              )}
            </Box>
          </Flex>
          {/* selectedCustomerOrgId 원래값 0 이므로 0일때 렌더링 x */}
          {selectedOrgId !== 0 && (
            <Flex direction={"column"} mb={4}>
              <Box
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                mt={8}
                mb={4}
              >
                <Text>멤버 목록</Text>
                <Box position="relative" ref={dropdownRef}>
                  {/* ✅ 클릭하면 드롭다운이 열리는 버튼 (이미지 버튼) */}
                  <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="sm"
                    variant="outline"
                    border={"none"}
                  >
                    <Image
                      src="/545674.png"
                      alt="Help Icon"
                      width={20}
                      height={20}
                    />
                  </Button>
                  {isOpen && (
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
                  )}
                </Box>
              </Box>
              <Box
                h={"400px"}
                w={"250px"}
                overflowY={"auto"}
                border="1px solid #ccc"
                borderRadius="8px"
                p="4"
              >
                {orgMembers?.length > 0 ? (
                  orgMembers.map((member) => {
                    const isSelected = selectedMembers.some(
                      (m) => m.id === member.id,
                    );
                    // 개발사 오너 체크
                    const isOwner = ownerMember?.id === member.id;

                    return (
                      <Box
                        key={member.id}
                        p="3"
                        borderRadius="md"
                        mb="2"
                        cursor={"pointer"}
                        bg={isSelected ? "blue.500" : ""}
                        color={isSelected ? "white" : "black"}
                        onClick={() => handleSelectMember(member)}
                      >
                        <Text>{member.name}</Text>
                        <Text>
                          {member.role} ({member.jobRole})
                        </Text>

                        {/* 오너 표시 */}
                        {setOwnerMember && (
                          <Button
                            fontSize="xs"
                            p={1}
                            mt={2}
                            borderRadius="md"
                            bg="blue.400"
                            _hover={{ bg: "blue.600" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isOwner) {
                                // 이미 오너면 오너 상태만 해제
                                setOwnerMember(undefined);
                              } else {
                                // 멤버도 아니면 멤버 추가부터
                                if (!isSelected) {
                                  setSelectedMembers((prev) => [
                                    ...prev,
                                    member,
                                  ]);
                                }
                                setOwnerMember(member);
                              }
                            }}
                          >
                            {isOwner ? "👑 Owner" : "Set as Owner"}
                          </Button>
                        )}
                      </Box>
                    );
                  })
                ) : (
                  <Text>멤버가 없습니다.</Text>
                )}
              </Box>
            </Flex>
          )}
        </Flex>
      </Flex>

      {/* 선택된 멤버 목록 */}
      <Flex
        mt={6}
        p={4}
        mr={10}
        mb={10}
        borderRadius="8px"
        border="1px solid #ccc"
        flexWrap="wrap"
        width="500px"
      >
        {selectedMembers.length > 0 ? (
          selectedMembers.map((member) => {
            const isOwner = ownerMember?.id === member.id;

            return (
              <Box
                key={member.id}
                borderRadius={"md"}
                m={2}
                cursor={"pointer"}
                _hover={{ bg: "blue.200" }}
                width={"45%"}
                minWidth={"200px"}
                textAlign="center"
                onClick={() => {
                  if (isOwner) {
                    // 이미 오너면 오너 상태만 해제
                    setOwnerMember?.(undefined);
                  } else {
                    handleSelectMember(member);
                  }
                }}
              >
                <Text fontWeight="bold">
                  {isOwner && "👑 "} {member.name}
                </Text>
                <Text fontSize="sm">
                  {member.role} ({member.jobRole})
                </Text>
              </Box>
            );
          })
        ) : (
          <Text color="gray.500">선택된 멤버 목록</Text>
        )}
      </Flex>
    </Flex>
  );
}
