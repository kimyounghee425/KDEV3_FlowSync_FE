"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Box } from "@chakra-ui/react";

import HeaderSection from "@/src/components/pages/ProjectsCreatePage/components/HeaderSection";
import DateSection from "@/src/components/pages/ProjectsCreatePage/components/DateSection";
import ContentSection from "@/src/components/pages/ProjectsCreatePage/components/ContentSection";
import OrganizationSelector from "@/src/components/pages/ProjectsCreatePage/components/OrganizationSelector";

import { fetchMembersWithinOrgApi } from "@/src/api/members";
import { fetchOrganizationDetails } from "@/src/api/organizations";
import {
  createProjectApi,
  deleteProjectApi,
  updateProjectApi,
} from "@/src/api/projects";
import { MemberProps, ProjectDetailProps } from "@/src/types";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";

interface ProjectFormProps {
  projectData?: ProjectDetailProps; // projectData가 있을 경우 수정 모드
  projectId?: string; // projectId가 있을 경우 수정 모드
}

export default function ProjectForm({
  projectData,
  projectId,
}: ProjectFormProps) {
  const router = useRouter();
  const isEditMode = !!projectId; // projectId가 있으면 수정 모드
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 📌 프로젝트 상태 관리
  const [formData, setFormData] = useState<ProjectDetailProps>({
    id: projectData?.id || "",
    name: projectData?.name || "",
    description: projectData?.description || "",
    detail: projectData?.detail || "",
    managementStep: projectData?.managementStep || "CONTRACT",
    startAt: projectData?.startAt || "",
    deadlineAt: projectData?.deadlineAt || "",
    // closeAt: projectData?.closeAt || "",
    devOwnerId: projectData?.devOwnerId || "",
    customerOwnerId: projectData?.customerOwnerId || "",
    customerOrgId: projectData?.customerOrgId || "",
    developerOrgId: projectData?.developerOrgId || "",
    members: projectData?.members || [],
  });

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
      const data = await fetchMembersWithinOrgApi(organizationId);
      setMembers(data.data?.members || []);
    } catch (error) {
      console.error(error);
      setMembers([]);
    }
  };

  // ✅ 프로젝트 생성 시, 멤버 자동 선택 방지 (수정 시 기존 데이터 유지)
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
  }, [formData.customerOrgId, formData.developerOrgId, projectId]);

  // 🔹 프로젝트 수정 시 기존 데이터 반영 (멤버 & Owner)
  useEffect(() => {
    async function fetchOrgDetails() {
      if (projectData) {
        const customerOrg = await fetchOrganizationDetails(
          projectData.customerOrgId,
        );
        setSelectedCustomerOrgName(customerOrg?.name || "");
        const developerOrg = await fetchOrganizationDetails(
          projectData.developerOrgId,
        );
        setSelectedDeveloperOrgName(developerOrg?.name || "");
      }
    }
    fetchOrgDetails();
  }, [formData.customerOrgId, formData.developerOrgId, projectId]);

  // 프로젝트에 배정된 전체 멤버 업데이트
  useEffect(() => {
    setSelectedMembers([
      ...selectedCustomerMembers.map((member) => Number(member.id)),
      ...selectedDeveloperMembers.map((member) => Number(member.id)),
    ]);
  }, [selectedCustomerMembers, selectedDeveloperMembers]);

  const convertToKST = (date: Date | null | undefined): string => {
    if (!date || isNaN(date.getTime())) {
      return ""; // 🔥 `null` 대신 빈 문자열 반환
    }
    // 🔹 한국 시간으로 변환 (UTC+9)
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(date.getTime() + kstOffset);

    // 🔹 날짜 형식: YYYY-MM-DD HH:mm:ss
    return kstDate.toISOString().replace("T", " ").split(".")[0];
  };

  // 📌 **프로젝트 생성/수정 API 호출**
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.startAt ||
      !formData.deadlineAt ||
      !formData.customerOrgId ||
      !formData.developerOrgId ||
      selectedCustomerMembers.length === 0 ||
      selectedDeveloperMembers.length === 0 ||
      !formData.customerOwnerId ||
      !formData.devOwnerId
    ) {
      alert("필수 정보를 입력해주세요.");
      return;
    }

    const requestBody = {
      ...formData,
      // startAt: formData.startAt.replace("T", " ").split(".")[0],
      // closeAt: formData.closeAt.replace("T", " ").split(".")[0],
      startAt: formData.startAt ? convertToKST(new Date(formData.startAt)) : "",
      deadlineAt: formData.deadlineAt
        ? convertToKST(new Date(formData.deadlineAt))
        : "",
      // closeAt: undefined, // ✅ closeAt은 백엔드에서 자동 업데이트되므로 요청에서 제외
      members: [
        ...selectedCustomerMembers.map((m) => Number(m.id)),
        ...selectedDeveloperMembers.map((m) => Number(m.id)),
      ],
    };

    console.log("서버에 보낼 데이터:", requestBody); // ✅ 요청 전에 확인

    try {
      if (isEditMode) {
        await updateProjectApi(projectId, requestBody);
        alert("프로젝트가 성공적으로 수정되었습니다.");
        router.push(`/projects/${projectId}`); // 수정 후 프로젝트 상세 페이지로 이동
      } else {
        await createProjectApi(requestBody);
        alert("프로젝트가 성공적으로 생성되었습니다.");
        router.push("/"); // 생성 후 목록 페이지로 이동
      }
    } catch (error) {
      console.error(error);
      alert("프로젝트 처리 중 오류가 발생했습니다.");
    }
  };

  // 📌 **프로젝트 삭제 API 호출**
  const handleDelete = async () => {
    try {
      if (isEditMode) {
        await deleteProjectApi(projectId);
        alert("프로젝트가 성공적으로 삭제되었습니다.");
        router.back(); // 삭제 후 프로젝트 목록 페이지로 이동
      }
    } catch (error) {
      console.error(error);
      alert("프로젝트 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    console.log("최신 formData 값:", formData);
  }, [formData]);

  return (
    <Flex width="100%" justifyContent="center">
      <InputFormLayout
        title={isEditMode ? "프로젝트 상세 조회" : "프로젝트 생성"}
        onSubmit={handleSubmit}
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
              closeAt={formData.deadlineAt} // ✅ 기존 closeAt → deadlineAt 사용
              setStartAt={(date) => {
                setFormData((prev) => ({
                  ...prev,
                  startAt: date ? convertToKST(new Date(date)) : prev.startAt,
                }));
              }}
              setCloseAt={(date) => {
                setFormData((prev) => ({
                  ...prev,
                  deadlineAt: date
                    ? convertToKST(new Date(date))
                    : prev.deadlineAt,
                }));
              }}
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
