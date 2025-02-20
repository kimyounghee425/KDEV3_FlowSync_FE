"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputForm from "@/src/components/common/InputForm";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import { MemberProps } from "@/src/types";
import { fetchMemberDetails } from "@/src/api/members";
import { validationRulesOfUpdatingMember } from "@/src/constants/validationRules"; // 유효성 검사 규칙 import
import {
  Box,
  createListCollection,
  Flex,
  Heading,
  HStack,
  Stack,
  Table,
} from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/src/components/ui/radio";
import SearchSection from "@/src/components/common/SearchSection";
import FilterSelectBox from "@/src/components/common/FilterSelectBox";
import { useMemberProjectList } from "@/src/hook/useFetchBoardList";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import CommonTable from "@/src/components/common/CommonTable";
import StatusTag from "@/src/components/pages/ProjectsPage/components/ManagementStepTag";
import Pagination from "@/src/components/common/Pagination";
import { useDeleteMember, useUpdateMember } from "@/src/hook/useMutationData";
import { showToast } from "@/src/utils/showToast";

const projectStatusFramework = createListCollection<{
  label: string;
  value: string;
}>({
  items: [
    { label: "전체", value: "" },
    { label: "계약", value: "CONTRACT" },
    { label: "진행중", value: "IN_PROGRESS" },
    { label: "납품완료", value: "COMPLETED" },
    { label: "하자보수", value: "MAINTENANCE" },
    { label: "일시중단", value: "PAUSED" },
    { label: "삭제", value: "DELETED" },
  ],
});

const STATUS_LABELS: Record<string, string> = {
  CONTRACT: "계약",
  IN_PROGRESS: "진행중",
  COMPLETED: "납품완료",
  MAINTENANCE: "하자보수",
  PAUSED: "일시중단",
  DELETED: "삭제",
};

export default function MemberDetailForm({
  memberData,
  memberId,
}: {
  memberData: MemberProps; // 회원 상세 타입
  memberId: string;
}) {
  const route = useRouter();
  const [formData, setFormData] = useState<MemberProps>(memberData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({}); // 유효성 검사 에러 상태
  const [isFetching, setIsFetching] = useState<boolean>(false); // 새로 렌더링 여부
  const [isChanged, setIsChanged] = useState<{ [key: string]: boolean }>({});
  const isUpdateDisabled =
    Object.values(isChanged).every((changed) => !changed) ||
    Object.keys(errors).length > 0;
  const { mutate: updateMember, error: MemberUpdateError } = useUpdateMember();
  const { mutate: deleteMember, error: MemberDeleteError } = useDeleteMember();

  // formData가 변경될 때만 실행되도록 설정
  useEffect(() => {
    validateInputs();
  }, [formData]);

  // 회원 데이터 다시 불러오기 (업데이트 후)
  async function refetchMemberData() {
    if (Object.keys(isChanged).length === 0) return; // 변경된 값 없으면 요청 안 함

    setIsFetching(true);
    try {
      const updatedData = await fetchMemberDetails(memberId);
      // 데이터가 변경되지 않더라도 리렌더링을 강제하기 위해 새로운 객체로 할당
      setFormData({ ...updatedData });
      // 유효성 검사 실행 (버튼 활성화 여부 및 에러 메시지 갱신)
      validateInputs();
      setIsChanged({}); // 모든 필드 변경 상태 초기화
    } catch (error) {
      // "회원 데이터 갱신 실패:"
    } finally {
      setIsFetching(false);
    }
  }

  // 입력 값 유효성 검사
  function validateInputs() {
    // `Object.entries()`를 사용하여 모든 필드에 대한 유효성 검사 수행
    const updatedErrors = Object.entries(
      validationRulesOfUpdatingMember,
    ).reduce(
      (errors, [inputName, validationRule]) => {
        if (!validationRule.isValid(formData[inputName as keyof MemberProps])) {
          errors[inputName] = validationRule.errorMessage;
        }
        return errors;
      },
      {} as { [inputName: string]: string },
    );

    setErrors(updatedErrors); // 에러 상태 업데이트
    return Object.keys(updatedErrors).length === 0; // 에러가 없으면 true 반환
  }

  // 입력 값 변경 시 상태(formData)를 업데이트.
  function handleInputUpdate(inputName: string, value: string) {
    let formattedValue = value;

    // 공백을 제거해야 하는 필드
    const noWhitespaceFields = ["name", "phoneNum", "jobRole", "jobTitle"];

    if (noWhitespaceFields.includes(inputName)) {
      formattedValue = value.trim().replace(/\s{2,}/g, " "); // 연속 공백을 하나로 줄임
    }

    if (inputName === "phoneNum") {
      // 숫자만 남기기 (주소 입력란 제외)
      const onlyNumbers = value.replace(/[^0-9]/g, "");

      // 하이픈 추가 (전화번호, 사업자 등록번호에만 적용)
      const formatWithHyphen = (value: string, pattern: number[]) => {
        let formatted = "";
        let index = 0;

        for (const length of pattern) {
          if (index >= value.length) break; // 안전한 길이 체크 추가
          if (index + length <= value.length) {
            formatted +=
              (index === 0 ? "" : "-") + value.slice(index, index + length);
            index += length;
          } else {
            formatted += (index === 0 ? "" : "-") + value.slice(index);
            break;
          }
        }
        return formatted;
      };

      if (inputName === "phoneNum") {
        formattedValue = formatWithHyphen(onlyNumbers, [3, 4, 4]); // 010-1234-5678
      }
    }

    // 상태 업데이트 (주소 입력란은 원본 값 유지)
    setFormData((prev) => ({
      ...prev,
      [inputName]: formattedValue,
    }));

    // 변경된 상태 추적
    setIsChanged((prev) => {
      if (!prev[inputName]) {
        return { ...prev, [inputName]: true };
      }
      return prev;
    });
  }

  // Enter 키 입력 시 기본 submit 작동 방지
  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 제출 방지
    }
  }
  // 회원 정보 수정
  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    if (!validateInputs()) {
      const errorMessage = "입력값을 다시 확인해주세요.";
      showToast({
        title: "요청 실패",
        description: errorMessage,
        type: "error",
        duration: 3000,
        error: errorMessage,
      });

      setIsSubmitting(false);
      return;
    }

    try {
      const response = await updateMember(memberId, {
        name: formData.name,
        phoneNum: formData.phoneNum,
        jobRole: formData.jobRole,
        jobTitle: formData.jobTitle,
        introduction: formData.introduction,
        remark: formData.remark,
      });
      // 수정된 데이터만 렌더링
      refetchMemberData();
      setIsChanged({}); // 모든 필드 변경 상태 및 스타일 초기화
    } catch (error) {
      const errorMessage = "수정 실패: 다시 시도해주세요.";
      showToast({
        title: "요청 실패",
        description: errorMessage,
        type: "error",
        duration: 3000,
        error: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // 회원 삭제 (삭제 컴포넌트(공통)는 InputFormLayout.tsx 에서 관리)
  async function handleDelete(deleteReason: string) {
    const response = await deleteMember(memberId, ""); // 탈퇴 사유 입력값 전달
    if (response === null) return;
    route.back();
  }

  return (
    <>
      <InputFormLayout
        title="회원 상세 조회"
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
        isDisabled={isUpdateDisabled} // 버튼 비활성화 조건 추가
        onDelete={handleDelete}
        deleteEntityType="회원" // 삭제 대상 선택 ("회원" | "업체" | "프로젝트")
      >
        <Box>
          <Flex direction="row" align="center" mb={4}>
            <Box>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: "#4A5568",
                  marginRight: "2.3rem",
                }}
              >
                회원 유형을 선택하세요
              </span>
            </Box>
            <Box>
              <RadioGroup value={formData.role} disabled>
                <HStack gap={6}>
                  <Radio value="MEMBER">일반 회원</Radio>
                  <Radio value="ADMIN">관리자</Radio>
                </HStack>
              </RadioGroup>
            </Box>
          </Flex>
        </Box>
        {/* 성함, 로그인 Email */}
        <Flex gap={4} align="center">
          <Box flex="1">
            <InputForm
              id="name"
              type="text"
              label="성함"
              value={formData.name}
              error={errors.name ?? undefined} // 에러 값이 null 이면 안돼서 undefined로 변환 (이하 동일)
              onChange={(e) => handleInputUpdate("name", e.target.value)}
              isChanged={!!isChanged["name"]}
            />
          </Box>
          {/* 고객사/개발사 선택 모달 */}
          <Box flex="1" display="flex" flexDirection="column">
            <InputForm
              id="organizationName"
              type="text"
              label="소속 업체"
              value={formData.organizationName}
              disabled
            />
          </Box>
          {/* (수정불가) 로그인 Email */}
          <Box flex="1">
            <InputForm
              id="email"
              type="email"
              label="로그인 Email"
              value={formData.email}
              disabled
            />
          </Box>
        </Flex>
        {/* 연락처, 직무, 직함 */}
        <Flex gap={4} align="center">
          <Box flex="1">
            <InputForm
              id="phoneNum"
              type="tel"
              label="연락처"
              value={formData.phoneNum}
              error={errors.phoneNum ?? undefined}
              onChange={(e) => handleInputUpdate("phoneNum", e.target.value)}
              isChanged={!!isChanged["phoneNum"]}
            />
          </Box>
          <Box flex="1">
            <InputForm
              id="jobRole"
              type="text"
              label="직무"
              value={formData.jobRole}
              error={errors.jobRole ?? undefined}
              onChange={(e) => handleInputUpdate("jobRole", e.target.value)}
              isChanged={!!isChanged["jobRole"]}
            />
          </Box>
          <Box flex="1">
            <InputForm
              id="jobTitle"
              type="text"
              label="직함"
              value={formData.jobTitle}
              error={errors.jobTitle ?? undefined}
              onChange={(e) => handleInputUpdate("jobTitle", e.target.value)}
              isChanged={!!isChanged["jobTitle"]}
            />
          </Box>
        </Flex>
        {/* 직무, 직함 */}
        <Flex gap={4} align="center">
          <Box flex="1"></Box>
        </Flex>
        {/*회원 소개, 특이사항 */}
        <Flex gap={4} align="center">
          <Box flex="1">
            <InputForm
              id="introduction"
              type="text"
              label="회원 소개"
              value={formData.introduction}
              error={errors.introduction ?? undefined}
              onChange={(e) =>
                handleInputUpdate("introduction", e.target.value)
              }
              isChanged={!!isChanged["introduction"]}
            />
          </Box>
          <Box flex="1">
            <InputForm
              id="remark"
              type="text"
              label="특이사항"
              value={formData.remark}
              error={errors.remark ?? undefined}
              onChange={(e) => handleInputUpdate("remark", e.target.value)}
              isChanged={!!isChanged["remark"]}
            />
          </Box>
        </Flex>
      </InputFormLayout>

      <Stack align="center" width="full" marginTop="2rem">
        <Box
          maxWidth="1000px" // InputFormLayout과 동일한 너비 적용
          width="100%"
          p="1.5rem"
          borderRadius="lg"
          bg="white"
          boxShadow="md"
          marginX="auto"
          justifyContent="center"
        >
          <Suspense>
            {/* 회원 별 참여 중 프로젝트 목록 조회 */}
            <MemberProjectList memberId={memberId} />
          </Suspense>
        </Box>
      </Stack>
    </>
  );
}

// 회원 별 참여 중 프로젝트 목록 조회
function MemberProjectList({ memberId }: { memberId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams?.get("keyword") || "";
  const managementStep = searchParams?.get("managementStep") || "";
  const currentPage = parseInt(searchParams?.get("currentPage") || "1", 10);
  const pageSize = parseInt(searchParams?.get("pageSize") || "10", 5);

  const {
    data: projectList,
    paginationInfo,
    loading: projectListLoading,
    error: projectListError,
  } = useMemberProjectList(
    memberId,
    keyword,
    managementStep,
    currentPage,
    pageSize,
  );

  /**
   * 페이지 변경 시 호출되는 콜백 함수
   * - 쿼리 파라미터를 갱신하고, fetchProjectList를 다시 호출합니다.
   *
   * @param page 새로 이동할 페이지 번호
   */
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("currentPage", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
  };

  /**
   * 테이블 행 클릭 시 호출되는 콜백
   * - 특정 프로젝트의 상세 화면(/projects/[id]/tasks)로 이동
   *
   * @param projectId 프로젝트 ID (백엔드 혹은 테이블에서 받아온 값)
   */
  const handleRowClick = (projectId: string) => {
    const project = projectList?.find((p) => p.id === projectId);
    if (project) {
      router.push(`/projects/${project.id}/questions`);
    }
  };

  return (
    <>
      <Stack width="full">
        <Heading size="2xl" color="gray.600">
          참여 중 프로젝트
        </Heading>
        <Flex justifyContent="end">
          {/* 프로젝트 검색/필터 섹션 (검색창, 필터 옵션 등) */}
          <SearchSection keyword={keyword} placeholder="프로젝트명 입력">
            <FilterSelectBox
              statusFramework={projectStatusFramework}
              selectedValue={managementStep}
              placeholder="관리단계"
              queryKey="managementStep"
            />
          </SearchSection>
        </Flex>
        {projectListError && (
          <ErrorAlert message="프로젝트 목록을 불러오지 못했습니다. 다시 시도해주세요." />
        )}
        <CommonTable
          columnsWidth={
            <>
              <Table.Column htmlWidth="15%" />
              <Table.Column htmlWidth="15%" />
              <Table.Column htmlWidth="15%" />
              <Table.Column htmlWidth="12%" />
              <Table.Column htmlWidth="12%" />
              <Table.Column htmlWidth="12%" />
              <Table.Column htmlWidth="12%" />
            </>
          }
          headerTitle={
            <Table.Row
              css={{
                "& > th": { textAlign: "center" },
              }}
            >
              <Table.ColumnHeader>프로젝트명</Table.ColumnHeader>
              <Table.ColumnHeader>고객사</Table.ColumnHeader>
              <Table.ColumnHeader>개발사</Table.ColumnHeader>
              <Table.ColumnHeader>관리단계</Table.ColumnHeader>
              <Table.ColumnHeader>시작일</Table.ColumnHeader>
              <Table.ColumnHeader>예상 마감일</Table.ColumnHeader>
              <Table.ColumnHeader>납품 완료일</Table.ColumnHeader>
            </Table.Row>
          }
          data={projectList || []}
          loading={projectListLoading}
          renderRow={(project) => {
            return (
              <Table.Row
                key={project.id}
                onClick={() => handleRowClick(project.id)}
                css={{
                  "&:hover": { backgroundColor: "#f1f1f1" },
                  cursor: "pointer",
                  opacity: 1,
                  "& > td": { textAlign: "center" },
                }}
              >
                <Table.Cell>{project.name}</Table.Cell>
                <Table.Cell>{project.customerName}</Table.Cell>
                <Table.Cell>{project.developerName}</Table.Cell>
                <Table.Cell>
                  <StatusTag>{STATUS_LABELS[project.managementStep]}</StatusTag>
                </Table.Cell>
                <Table.Cell>{project.startAt}</Table.Cell>
                <Table.Cell>{project.deadlineAt}</Table.Cell>
                <Table.Cell>
                  {project.closeAt === "" ? "-" : project.closeAt}
                </Table.Cell>
              </Table.Row>
            );
          }}
        />
        {/*
         * 페이지네이션 컴포넌트
         * paginationInfo: 현재 페이지, 총 페이지, 페이지 크기 등의 정보
         * handlePageChange: 페이지 이동 시 실행될 콜백
         */}
        <Pagination
          paginationInfo={
            paginationInfo && {
              ...paginationInfo,
              currentPage: paginationInfo.currentPage,
            }
          }
          handlePageChange={handlePageChange}
        />
      </Stack>
    </>
  );
}
