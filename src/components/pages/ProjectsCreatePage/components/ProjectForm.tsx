"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Box } from "@chakra-ui/react";

import HeaderSection from "@/src/components/pages/ProjectsCreatePage/components/HeaderSection";
import ContentSection from "@/src/components/pages/ProjectsCreatePage/components/ContentSection";
import OrganizationSelector from "@/src/components/pages/ProjectsCreatePage/components/OrganizationSelector";

import { fetchMembersWithinOrgApi } from "@/src/api/members";
import { fetchOrganizationDetails } from "@/src/api/organizations";
import { MemberProps, ProjectDetailProps } from "@/src/types";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import {
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from "@/src/hook/useMutationData";
import DateSection from "@/src/components/pages/ProjectsCreatePage/components/DateSection";
import { validateForm } from "@/src/hook/useValidation";

interface ProjectFormProps {
  projectData?: ProjectDetailProps; // projectData가 있을 경우 수정 모드
  projectId?: string; // projectId가 있을 경우 수정 모드
}

export default function ProjectForm({
  projectData,
  projectId,
}: ProjectFormProps) {
  const route = useRouter();
  const isEditMode = !!projectId; // projectId가 있으면 수정 모드
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // 업체 상태 변경 훅
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();
  // 프로젝트 상태 관리
  const [formData, setFormData] = useState<ProjectDetailProps>({
    id: projectData?.id || "",
    name: projectData?.name || "",
    description: projectData?.description || "",
    detail: projectData?.detail || "",
    managementStep: projectData?.managementStep || "CONTRACT",
    startAt: projectData?.startAt || "",
    deadlineAt: projectData?.deadlineAt || "",
    devOwnerId: projectData?.devOwnerId || "",
    customerOwnerId: projectData?.customerOwnerId || "",
    customerOrgId: projectData?.customerOrgId || "",
    developerOrgId: projectData?.developerOrgId || "",
    members: projectData?.members || [],
  });

  const [customerOwnerId, setCustomerOwnerId] = useState<string>(
    formData.customerOwnerId,
  );
  const [developerOwnerId, setDeveloperOwnerId] = useState<string>(
    formData.devOwnerId,
  );
  const [selectedCustomerOrgName, setSelectedCustomerOrgName] = useState("");

  const [selectedDeveloperOrgName, setSelectedDeveloperOrgName] = useState("");

  // 멤버 관련 상태
  const [selectedCustomerMembers, setSelectedCustomerMembers] = useState<
    MemberProps[]
  >([]);
  const [selectedDeveloperMembers, setSelectedDeveloperMembers] = useState<
    MemberProps[]
  >([]);

  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  // 특정 조직의 멤버를 가져오는 공통 함수
  const fetchOrganizationMembers = async (
    organizationId: string,
    setMembers: React.Dispatch<React.SetStateAction<MemberProps[]>>,
  ) => {
    if (!organizationId) {
      setMembers([]);
      return;
    }
    try {
      console.log("업체 id: ", organizationId);
      const response = await fetchMembersWithinOrgApi(organizationId);
      const allMembers = response.data.members;
      console.log("업체 소속 회원목록: ", allMembers);
      const participants = projectData?.members.map((id: string) => id);
      console.log("배정된 회원목록: ", participants);
      const commonMembers = allMembers.filter((member: MemberProps) =>
        participants?.includes(member.id),
      );
      console.log("업체 멤버들: ", commonMembers);
      setMembers(commonMembers);
    } catch (error) {
      // setMembers([]);
    }
  };

  // 프로젝트 생성 시, 멤버 자동 선택 방지 (수정 시 기존 데이터 유지)
  useEffect(() => {
    if (projectId) {
      if (formData.customerOrgId) {
        fetchOrganizationMembers(
          formData.customerOrgId,
          setSelectedCustomerMembers,
        );
      }
      if (formData.developerOrgId) {
        fetchOrganizationMembers(
          formData.developerOrgId,
          setSelectedDeveloperMembers,
        );
      }
    }
  }, []);

  // 프로젝트 수정 시 기존 데이터 반영 (멤버 & Owner)
  useEffect(() => {
    async function fetchOrgDetails() {
      if (projectData) {
        const customerOrg = await fetchOrganizationDetails(
          projectData.customerOrgId,
        );
        console.log("customerOrg:", customerOrg);
        setSelectedCustomerOrgName(customerOrg?.name || "");
        const developerOrg = await fetchOrganizationDetails(
          projectData.developerOrgId,
        );
        console.log("developerOrg:", developerOrg);
        setSelectedDeveloperOrgName(developerOrg?.name || "");
      }
    }
    fetchOrgDetails();
  }, []);

  // 프로젝트에 배정된 전체 멤버 업데이트
  useEffect(() => {
    console.log("선택된 고객사 회원 목록: ", selectedCustomerMembers);
    console.log("선택된 개발사 회원 목록: ", selectedDeveloperMembers);
    setSelectedMembers([
      ...selectedCustomerMembers.map((member) => Number(member.id)),
      ...selectedDeveloperMembers.map((member) => Number(member.id)),
    ]);
  }, [selectedCustomerMembers, selectedDeveloperMembers]);

  // **프로젝트 생성/수정 API 호출**
  const handleSubmit = async (event: React.FormEvent) => {
    event?.preventDefault();

    formData.name = formData.name.trim().replace(/\s{2,}/g, " ");
    formData.description = formData.description.trim().replace(/\s{2,}/g, " ");

    if (!validateForm(formData)) return; // 유효성 검사 실패 시 종료

    const requestBody = {
      ...formData,
      members: [...selectedCustomerMembers, ...selectedDeveloperMembers].map(
        (m) => m.id,
      ),
    };

    if (isEditMode) {
      const response = await updateProject(projectId, requestBody);

      if (response === null) return;
      route.back();
    } else {
      const response = await createProject(requestBody);
      if (response === null) return;

      route.push("/");
    }
  };

  // **프로젝트 삭제 API 호출**
  const handleDelete = async () => {
    if (projectId) {
      const response = await deleteProject(projectId);
      if (response === null) return;

      if (isEditMode) {
        route.back();
      } else {
        route.refresh();
      }
    }
  };

  useEffect(() => {}, [formData]);

  return (
    <Flex width="100%" justifyContent="center">
      <InputFormLayout
        title={isEditMode ? "프로젝트 수정" : "프로젝트 생성"}
        onSubmit={(event) => handleSubmit(event)}
        isLoading={isSubmitting}
        isDisabled={false} // 버튼 비활성화 조건 추가
        onDelete={isEditMode ? handleDelete : undefined}
        deleteEntityType="프로젝트"
      >
        <Flex
          width="100%"
          gap="1rem"
          justifyContent="center"
          alignItems="center"
          padding="1rem"
          marginTop="1rem"
        >
          {/* 프로젝트 헤더 (관리 단계, 프로젝트명, 시작일, 종료일) */}
          <Box flex="1">
            <HeaderSection
              name={formData.name}
              managementStep={formData.managementStep}
              setName={(name) => setFormData((prev) => ({ ...prev, name }))}
              setManagementStep={(step) =>
                setFormData((prev) => ({ ...prev, managementStep: step }))
              }
            />
          </Box>
          <Box flex="1">
            <DateSection
              startAt={formData.startAt}
              deadlineAt={formData.deadlineAt} // 기존 closeAt → deadlineAt 사용
              setStartAt={(date) =>
                setFormData((prev) => ({ ...prev, startAt: date }))
              }
              setDeadlineAt={(date) =>
                setFormData((prev) => ({ ...prev, deadlineAt: date }))
              }
            />
          </Box>
        </Flex>

        {/* 프로젝트 설명 (description & detail) */}
        <Flex width="100%">
          <ContentSection
            description={formData.description}
            detail={formData.detail}
            setDetail={(detail) => setFormData((prev) => ({ ...prev, detail }))}
            setDescription={(description) =>
              setFormData((prev) => ({ ...prev, description }))
            }
          />
        </Flex>

        {/* 고객사 및 개발사 선택 */}
        <Flex direction="column" gap="1rem" marginBottom="1.5rem">
          <OrganizationSelector
            title="고객사 지정"
            organizationType="CUSTOMER"
            selectedOrganizationId={formData.customerOrgId}
            setSelectedOrganizationId={(id) =>
              setFormData((prev) => ({ ...prev, customerOrgId: id }))
            }
            selectedOrganizationName={selectedCustomerOrgName}
            setSelectedOrganizationName={setSelectedCustomerOrgName}
            selectedMembers={selectedCustomerMembers}
            setSelectedMembers={setSelectedCustomerMembers}
            ownerId={formData.customerOwnerId}
            setOwnerId={(id) =>
              setFormData((prev) => ({ ...prev, customerOwnerId: id }))
            }
          />
          <OrganizationSelector
            title="개발사 지정"
            organizationType="DEVELOPER"
            selectedOrganizationId={formData.developerOrgId}
            setSelectedOrganizationId={(id) =>
              setFormData((prev) => ({ ...prev, developerOrgId: id }))
            }
            selectedOrganizationName={selectedDeveloperOrgName}
            setSelectedOrganizationName={setSelectedDeveloperOrgName}
            selectedMembers={selectedDeveloperMembers}
            setSelectedMembers={setSelectedDeveloperMembers}
            ownerId={formData.devOwnerId}
            setOwnerId={(id) =>
              setFormData((prev) => ({ ...prev, devOwnerId: id }))
            }
          />
        </Flex>
      </InputFormLayout>
    </Flex>
  );
}
