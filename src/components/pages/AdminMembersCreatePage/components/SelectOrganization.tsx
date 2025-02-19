// 회사만 선택하는 컴포넌트

import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import InputForm from "@/src/components/common/InputForm";

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

interface SelectedOrganizationProps {
  organizations: OrgProps[];
  selectedOrganization?: OrgProps;
  setSelectedOrganization: React.Dispatch<
    React.SetStateAction<OrgProps | undefined>
  >;
}

export default function SelectedOrganization({
  organizations,
  selectedOrganization,
  setSelectedOrganization,
}: SelectedOrganizationProps) {
  return (
    <Flex minWidth={"700px"}>
      <Flex direction={"column"} mr={5}>
        <InputForm
          id="selectedOrganization"
          type="text"
          label="소속 업체"
          placeholder="소속 업체를 선택하세요"
          value={selectedOrganization?.name || ""}
          error={""}
          onChange={() => {}} // 읽기 전용으로 설정 (사용자가 직접 입력 불가능)
          disabled={true} // 입력 불가능하게 설정
        />
        <Box
          h={"400px"}
          w={"250px"}
          overflowY={"auto"}
          border="1px solid #ccc"
          borderRadius="8px"
          p="4"
          mb={4}
        >
          {organizations?.length > 0 ? (
            organizations.map((org) => (
              <Box
                key={org.id}
                p="3"
                borderRadius={"md"}
                bg={selectedOrganization === org ? "blue.500" : ""}
                color={selectedOrganization === org ? "white" : "black"}
                cursor="pointer"
                mb="2"
                _hover={{ bg: "blue.200", color: "white" }}
                onClick={() => setSelectedOrganization(org)}
              >
                <Text>
                  {org.name}({org.type})
                </Text>
              </Box>
            ))
          ) : (
            <Text>조회된 회사가 없습니다.</Text>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
