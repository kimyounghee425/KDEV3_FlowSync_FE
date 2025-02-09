"use client";

// 외부 라이브러리
import React, { useState, useEffect } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";

// 절대 경로 파일
import HeaderSection from "@/src/components/pages/ProjectsCreatePage/components/HeaderSection";
import DateSection from "@/src/components/pages/ProjectsCreatePage/components/DateSection";
import ContentSection from "@/src/components/pages/ProjectsCreatePage/components/ContentSection";
import SelectOrganizationSection from "@/src/components/pages/ProjectsCreatePage/components/SelectOrganizationSection";

import { getOrganizationsApi } from "@/src/api/getOrganization";
import { getMembersApi } from "@/src/api/getMembersApi";
import { createProjectApi } from "@/src/api/registerProject";

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

export default function ProjectForm() {
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("IN_PROGRESS");
  const [managementStep, setManagementStep] = useState<string>("CONTRACT");
  const [startAt, setStartAt] = useState<string>("");
  const [closeAt, setCloseAt] = useState<string>("");
  const [description, setDescription] = useState<string>(""); // 짧은 설명
  const [detail, setDetail] = useState<string>(""); // 긴 설명

  // 고객사 관련 상태
  const [customerOrg, setCustomerOrg] = useState<OrgProps[]>([]); // 전체 고객사 목록
  const [selectedCustomerOrgId, setSelectedCustomerOrgId] = useState<number>(0); // 선택한 고객사
  const [customerMembers, setCustomerMembers] = useState<Member[]>([]); // 고객사 멤버
  const [selectedCustomerMembers, setSelectedCustomerMembers] = useState<
    Member[]
  >([]);
  const [customerOwnerMember, setCustomerOwnerMember] = useState<
    Member | undefined
  >();

  // 개발사 관련 상태
  const [developerOrg, setDeveloperOrg] = useState<OrgProps[]>([]);
  const [selectedDeveloperOrgId, setSelectedDeveloperOrgId] =
    useState<number>(0);
  const [developerMembers, setDeveloperMembers] = useState<Member[]>([]);
  const [selectedDeveloperMembers, setSelectedDeveloperMembers] = useState<
    Member[]
  >([]);
  const [devOwnerMember, setDevOwnerMember] = useState<Member | undefined>();

  // 최종 선택된 멤버들 (고객사 + 개발사)
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const customerData = await getOrganizationsApi("CUSTOMER", "ACTIVE");
        const developerData = await getOrganizationsApi("DEVELOPER", "ACTIVE");

        setCustomerOrg(customerData.data.dtoList);
        setDeveloperOrg(developerData.data.dtoList);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCustomer();
  }, []);

  useEffect(() => {
    setSelectedCustomerMembers([]);
    if (selectedCustomerOrgId === 0) {
      setCustomerMembers([]);
      return;
    }
    async function fetchMember() {
      try {
        const data = await getMembersApi(selectedCustomerOrgId, 1, 100000);
        setCustomerMembers(data.data?.members);
      } catch (error) {
        console.error(error);
        setCustomerMembers([]);
      }
    }
    fetchMember();
  }, [selectedCustomerOrgId]);

  useEffect(() => {
    setSelectedDeveloperMembers([]);
    if (selectedDeveloperOrgId === 0) {
      setDeveloperMembers([]);
      return;
    }
    async function fetchMember() {
      try {
        const data = await getMembersApi(selectedDeveloperOrgId, 1, 100000);
        setDeveloperMembers(data.data.members);
        // console.log(data.data.members);
      } catch (error) {
        console.error(error);
        setDeveloperMembers([]);
      }
    }
    fetchMember();
  }, [selectedDeveloperOrgId]);

  // 고객사 멤버, 개발사 멤버 합쳐서 멤버 배열에 넣기.
  useEffect(() => {
    setSelectedMembers([
      ...selectedCustomerMembers.map((member) => member.id),
      ...selectedDeveloperMembers.map((member) => member.id),
    ]);
  }, [selectedCustomerMembers, selectedDeveloperMembers]);

  // 서버에 제출하는 로직 작성 << 해야함
  const handleSubmit = async () => {
    if (
      !name ||
      !startAt ||
      !closeAt ||
      selectedCustomerOrgId === 0 ||
      selectedDeveloperOrgId === 0 ||
      selectedCustomerMembers.length === 0 ||
      selectedDeveloperMembers.length === 0 ||
      devOwnerMember === undefined ||
      customerOwnerMember === undefined
    ) {
      alert("필수 정보를 입력해주세요.");
      return;
    }

    const requestBody = {
      name: name,
      description: description,
      detail: detail,
      status: status,
      managementStep: managementStep,
      progressStepId: 1, // << 이거 뭐임?
      startAt: startAt.replace("T", " ").split(".")[0],
      closeAt: closeAt.replace("T", " ").split(".")[0],
      devOwnerId: devOwnerMember.id,
      customerOwnerId: customerOwnerMember.id,
      developerOrgId: Number(selectedDeveloperOrgId),
      customerOrgId: Number(selectedCustomerOrgId),
      members: selectedMembers,
    };

    try {
      const response = await createProjectApi(requestBody);
      console.log("프로젝트 생성 성공 : ", response);
      alert("프로젝트가 성공적으로 생성되었습니다.");
    } catch (error) {
      console.error(error);
      alert("프로젝트 생성 중 오류가 발생했습니다.");
    }
  };

  // console.log(selectedDeveloperMembers);

  return (
    <Flex direction="column">
      <Box>
        <HeaderSection
          name={name}
          status={status}
          managementStep={managementStep}
          setName={setName}
          setStatus={setStatus}
          setManagementStep={setManagementStep}
        />
      </Box>
      <Flex direction={"row"} mb={10}>
        <Box>
          <SelectOrganizationSection
            title="고객사 목록"
            organizations={customerOrg}
            selectedOrgId={selectedCustomerOrgId}
            setSelectedOrgId={setSelectedCustomerOrgId}
            orgMembers={customerMembers}
            selectedMembers={selectedCustomerMembers}
            setSelectedMembers={setSelectedCustomerMembers}
            ownerMember={customerOwnerMember}
            setOwnerMember={setCustomerOwnerMember}
          />
        </Box>
        <Box>
          <SelectOrganizationSection
            title="개발사 목록"
            organizations={developerOrg}
            selectedOrgId={selectedDeveloperOrgId}
            setSelectedOrgId={setSelectedDeveloperOrgId}
            orgMembers={developerMembers}
            selectedMembers={selectedDeveloperMembers}
            setSelectedMembers={setSelectedDeveloperMembers}
            ownerMember={devOwnerMember}
            setOwnerMember={setDevOwnerMember}
          />
        </Box>
      </Flex>
      <Flex>
        <Box>
          <DateSection
            startAt={startAt}
            closeAt={closeAt}
            setStartAt={setStartAt}
            setCloseAt={setCloseAt}
          />
        </Box>
      </Flex>
      <Box>
        <ContentSection
          description={description}
          detail={detail}
          setDetail={setDetail}
          setDescription={setDescription}
        />
      </Box>

      <Button onClick={handleSubmit}>작성</Button>
    </Flex>
  );
}
