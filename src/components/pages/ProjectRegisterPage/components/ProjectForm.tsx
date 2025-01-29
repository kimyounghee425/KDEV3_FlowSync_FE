"use client";

// 외부 라이브러리
import React, { useState, useEffect } from "react";
import { Box, Input, Text, Flex, Button } from "@chakra-ui/react";

// 절대 경로 파일
import HeaderSection from "@/src/components/pages/ProjectRegisterPage/components/HeaderSection";
import DateSection from "@/src/components/pages/ProjectRegisterPage/components/DateSection";
import ContentSection from "@/src/components/pages/ProjectRegisterPage/components/ContentSection";
import SelectOrganizationSection from "@/src/components/pages/ProjectRegisterPage/components/SelectOrganizationSection";
import { getOrganizationsApi } from "@/src/api/getOrganization";
import { getMembersApi } from "@/src/api/getMembersApi";

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

export default function ProjectForm({ id }: { id: string }) {
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
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  ////////////////////////////////////////////////////////////
  // 임시 목데이터 (고객사 멤버)
  const mock = [
    {
      id: 1,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "ADMIN",
      status: "ACTIVE",
      email: "john.doe@example.com",
      name: "John Doe",
      phoneNum: "010-1111-1111",
      jobRole: "백엔드 개발자",
      jobTitle: "팀장",
      regAt: "2022-01-01 10:00:00",
      introduction: "안녕하세요, 존입니다.",
      remark: "리더십이 뛰어남",
    },
    {
      id: 2,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "jane.smith@example.com",
      name: "Jane Smith",
      phoneNum: "010-2222-2222",
      jobRole: "프론트엔드 개발자",
      jobTitle: "주임",
      regAt: "2021-12-15 09:30:00",
      introduction: "프론트엔드 전문가입니다.",
      remark: "UI/UX 감각이 뛰어남",
    },
    {
      id: 3,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "alex.johnson@example.com",
      name: "Alex Johnson",
      phoneNum: "010-3333-3333",
      jobRole: "데이터 엔지니어",
      jobTitle: "대리",
      regAt: "2021-08-10 14:45:00",
      introduction: "데이터 처리 전문가입니다.",
      remark: "SQL 최적화 경험 多",
    },
    {
      id: 4,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "ADMIN",
      status: "ACTIVE",
      email: "emily.brown@example.com",
      name: "Emily Brown",
      phoneNum: "010-4444-4444",
      jobRole: "시스템 엔지니어",
      jobTitle: "과장",
      regAt: "2020-11-20 11:20:00",
      introduction: "서버 관리 전문가입니다.",
      remark: "리눅스 전문가",
    },
    {
      id: 5,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "michael.scott@example.com",
      name: "Michael Scott",
      phoneNum: "010-5555-5555",
      jobRole: "프로젝트 매니저",
      jobTitle: "차장",
      regAt: "2019-05-05 15:10:00",
      introduction: "PM으로서 다수의 프로젝트를 관리했습니다.",
      remark: "리더십이 강함",
    },
    {
      id: 6,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "sarah.connor@example.com",
      name: "Sarah Connor",
      phoneNum: "010-6666-6666",
      jobRole: "QA 엔지니어",
      jobTitle: "주임",
      regAt: "2021-07-10 16:30:00",
      introduction: "소프트웨어 품질 테스트 전문가입니다.",
      remark: "세부적인 테스트 능력이 뛰어남",
    },
    {
      id: 7,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "bruce.wayne@example.com",
      name: "Bruce Wayne",
      phoneNum: "010-7777-7777",
      jobRole: "보안 전문가",
      jobTitle: "과장",
      regAt: "2020-04-25 13:40:00",
      introduction: "보안 관제 및 네트워크 보안 담당.",
      remark: "침해 사고 대응 경험 多",
    },
    {
      id: 8,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "ADMIN",
      status: "ACTIVE",
      email: "clark.kent@example.com",
      name: "Clark Kent",
      phoneNum: "010-8888-8888",
      jobRole: "데브옵스 엔지니어",
      jobTitle: "대리",
      regAt: "2019-08-30 17:00:00",
      introduction: "CI/CD 구축 및 자동화 담당.",
      remark: "도커 & 쿠버네티스 경험 多",
    },
    {
      id: 9,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "tony.stark@example.com",
      name: "Tony Stark",
      phoneNum: "010-9999-9999",
      jobRole: "AI 엔지니어",
      jobTitle: "부장",
      regAt: "2018-12-15 10:15:00",
      introduction: "머신러닝 모델 개발 담당.",
      remark: "딥러닝, 강화학습 전문가",
    },
    {
      id: 10,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "steve.rogers@example.com",
      name: "Steve Rogers",
      phoneNum: "010-1010-1010",
      jobRole: "HR 매니저",
      jobTitle: "차장",
      regAt: "2021-03-05 14:50:00",
      introduction: "HR 관련 업무 및 인재 채용 담당.",
      remark: "팀워크 강화 교육 경험 多",
    },
    {
      id: 11,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "steve.rogers@example.com",
      name: "스티브잡스",
      phoneNum: "010-1010-1010",
      jobRole: "HR 매니저",
      jobTitle: "차장",
      regAt: "2021-03-05 14:50:00",
      introduction: "HR 관련 업무 및 인재 채용 담당.",
      remark: "팀워크 강화 교육 경험 多",
    },
    {
      id: 12,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "steve.rogers@example.com",
      name: "김김김",
      phoneNum: "010-1010-1010",
      jobRole: "HR 매니저",
      jobTitle: "차장",
      regAt: "2021-03-05 14:50:00",
      introduction: "HR 관련 업무 및 인재 채용 담당.",
      remark: "팀워크 강화 교육 경험 多",
    },
  ];
  // 임시 목데이터2 (개발사 멤버)
  const mock2 = [
    {
      id: 1,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "ADMIN",
      status: "ACTIVE",
      email: "john.doe@example.com",
      name: "Alice Johnson",
      phoneNum: "010-1111-1111",
      jobRole: "백엔드 개발자",
      jobTitle: "팀장",
      regAt: "2022-01-01 10:00:00",
      introduction: "안녕하세요, 존입니다.",
      remark: "리더십이 뛰어남",
    },
    {
      id: 2,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "jane.smith@example.com",
      name: "Bob Williams",
      phoneNum: "010-2222-2222",
      jobRole: "프론트엔드 개발자",
      jobTitle: "주임",
      regAt: "2021-12-15 09:30:00",
      introduction: "프론트엔드 전문가입니다.",
      remark: "UI/UX 감각이 뛰어남",
    },
    {
      id: 3,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "alex.johnson@example.com",
      name: "Charlie Brown",
      phoneNum: "010-3333-3333",
      jobRole: "데이터 엔지니어",
      jobTitle: "대리",
      regAt: "2021-08-10 14:45:00",
      introduction: "데이터 처리 전문가입니다.",
      remark: "SQL 최적화 경험 多",
    },
    {
      id: 4,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "ADMIN",
      status: "ACTIVE",
      email: "emily.brown@example.com",
      name: "David Miller",
      phoneNum: "010-4444-4444",
      jobRole: "시스템 엔지니어",
      jobTitle: "과장",
      regAt: "2020-11-20 11:20:00",
      introduction: "서버 관리 전문가입니다.",
      remark: "리눅스 전문가",
    },
    {
      id: 5,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "michael.scott@example.com",
      name: "Emma Wilson",
      phoneNum: "010-5555-5555",
      jobRole: "프로젝트 매니저",
      jobTitle: "차장",
      regAt: "2019-05-05 15:10:00",
      introduction: "PM으로서 다수의 프로젝트를 관리했습니다.",
      remark: "리더십이 강함",
    },
    {
      id: 6,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "sarah.connor@example.com",
      name: "Fiona Anderson",
      phoneNum: "010-6666-6666",
      jobRole: "QA 엔지니어",
      jobTitle: "주임",
      regAt: "2021-07-10 16:30:00",
      introduction: "소프트웨어 품질 테스트 전문가입니다.",
      remark: "세부적인 테스트 능력이 뛰어남",
    },
    {
      id: 7,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "bruce.wayne@example.com",
      name: "George Thomas",
      phoneNum: "010-7777-7777",
      jobRole: "보안 전문가",
      jobTitle: "과장",
      regAt: "2020-04-25 13:40:00",
      introduction: "보안 관제 및 네트워크 보안 담당.",
      remark: "침해 사고 대응 경험 多",
    },
    {
      id: 8,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "ADMIN",
      status: "ACTIVE",
      email: "clark.kent@example.com",
      name: "Hannah Martinez",
      phoneNum: "010-8888-8888",
      jobRole: "데브옵스 엔지니어",
      jobTitle: "대리",
      regAt: "2019-08-30 17:00:00",
      introduction: "CI/CD 구축 및 자동화 담당.",
      remark: "도커 & 쿠버네티스 경험 多",
    },
    {
      id: 9,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "tony.stark@example.com",
      name: "Ian Robinson",
      phoneNum: "010-9999-9999",
      jobRole: "AI 엔지니어",
      jobTitle: "부장",
      regAt: "2018-12-15 10:15:00",
      introduction: "머신러닝 모델 개발 담당.",
      remark: "딥러닝, 강화학습 전문가",
    },
    {
      id: 10,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "steve.rogers@example.com",
      name: "Jack White",
      phoneNum: "010-1010-1010",
      jobRole: "HR 매니저",
      jobTitle: "차장",
      regAt: "2021-03-05 14:50:00",
      introduction: "HR 관련 업무 및 인재 채용 담당.",
      remark: "팀워크 강화 교육 경험 多",
    },
    {
      id: 11,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "steve.rogers@example.com",
      name: "Kevin Green",
      phoneNum: "010-1010-1010",
      jobRole: "HR 매니저",
      jobTitle: "차장",
      regAt: "2021-03-05 14:50:00",
      introduction: "HR 관련 업무 및 인재 채용 담당.",
      remark: "팀워크 강화 교육 경험 多",
    },
    {
      id: 12,
      organizationId: 12,
      organizationName: "CheckPing",
      role: "USER",
      status: "ACTIVE",
      email: "steve.rogers@example.com",
      name: "Liam Harris",
      phoneNum: "010-1010-1010",
      jobRole: "HR 매니저",
      jobTitle: "차장",
      regAt: "2021-03-05 14:50:00",
      introduction: "HR 관련 업무 및 인재 채용 담당.",
      remark: "팀워크 강화 교육 경험 多",
    },
  ];
  ////////////////////////////////////////////////////////////

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

  // 임시 고객사멤버 초기화. 아래 useEffect 가 진짜임.
  useEffect(() => {
    setCustomerMembers(mock);
    setDeveloperMembers(mock2);
  }, []);
  // console.log(customerMembers);

  // useEffect(() => {
  //   if (selectedCustomerOrgId === 0) return;
  //   async function fetchMember() {
  //     try {
  //       const data = await getMembersApi(selectedCustomerOrgId, 1, 100000);
  //       setCustomerMembers(data.members);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   fetchMember();
  // }, [selectedCustomerOrgId]);

  // 서버에 제출하는 로직 작성 << 해야함
  const handleSubmit = () => {
    console.log("제출 완료");
  };

  console.log(selectedDeveloperMembers);

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
            devOwnerMember={devOwnerMember}
            setDevOwnerMember={setDevOwnerMember}
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
