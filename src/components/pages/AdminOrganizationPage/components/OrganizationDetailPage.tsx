"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  Box,
  createListCollection,
  Flex,
  HStack,
  Stack,
  Table,
  Tabs,
  Text,
  useTabs,
} from "@chakra-ui/react";
import { LuFolder, LuUser } from "react-icons/lu";
import { Switch } from "@/src/components/ui/switch";
import { Radio, RadioGroup } from "@/src/components/ui/radio";
import InputForm from "@/src/components/common/InputForm";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import { MemberProps, OrganizationProps } from "@/src/types";
import { fetchOrganizationDetails } from "@/src/api/organizations";
import styles from "@/src/components/common/InputForm.module.css";
import { validationRulesOfOrganization } from "@/src/constants/validationRules";
import {
  useOrganizationMemberList,
  useOrganizationProjectList,
} from "@/src/hook/useFetchBoardList";
import SearchSection from "@/src/components/common/SearchSection";
import FilterSelectBox from "@/src/components/common/FilterSelectBox";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import CommonTable from "@/src/components/common/CommonTable";
import StatusTag from "@/src/components/pages/ProjectsPage/components/ManagementStepTag";
import Pagination from "@/src/components/common/Pagination";
import DropDownMenu from "@/src/components/common/DropDownMenu";
import {
  useActivateMemberStatus,
  useDeactivateMemberStatus,
  useDeleteMember,
  useDeleteOrganization,
  useUpdateOrganization,
} from "@/src/hook/useMutationData";

const memberRoleFramework = createListCollection<{
  label: string;
  value: string;
}>({
  items: [
    { label: "전체", value: "" },
    { label: "관리자", value: "ADMIN" },
    { label: "일반회원", value: "MEMBER" },
  ],
});

const memberStatusFramework = createListCollection<{
  label: string;
  value: string;
}>({
  items: [
    { label: "전체", value: "" },
    { label: "활성화", value: "ACTIVE" },
    { label: "비활성화", value: "INACTIVE" },
    { label: "삭제됨", value: "DELETED" },
  ],
});

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "관리자",
  MEMBER: "일반회원",
};

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

export default function OrganizationDetailPage({
  organizationData,
  organizationId,
}: {
  organizationData: OrganizationProps; // 업체 상세 타입
  organizationId: string;
}) {
  const route = useRouter();
  const [formData, setFormData] = useState<OrganizationProps>(organizationData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({}); // 유효성 검사 에러 상태
  const [isFetching, setIsFetching] = useState<boolean>(false); // 새로 렌더링 여부
  // 각 필드별 변경 상태를 관리하는 객체
  const [isChanged, setIsChanged] = useState<{ [key: string]: boolean }>({});
  const isUpdateDisabled =
    Object.keys(isChanged).length === 0 || Object.keys(errors).length > 0;
  const tabs = useTabs({
    defaultValue: "members",
  });
  const { mutate: updateOrganization } = useUpdateOrganization();
  const { mutate: deleteOrganization } = useDeleteOrganization();

  // formData가 변경될 때만 실행되도록 설정
  useEffect(() => {
    validateInputs();
  }, [formData]);

  // 첨부된 파일 불러오기
  useEffect(() => {
    return () => {
      if (
        formData.brCertificateUrl &&
        typeof formData.brCertificateUrl === "string" &&
        formData.brCertificateUrl.includes("|")
      ) {
        const [, fileUrl] = formData.brCertificateUrl.split("|");
        // 파일 교체 후에도 이전 파일이 유지될 가능성 방지
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [formData.brCertificateUrl]);

  // 업체 데이터 다시 불러오기 (업데이트 후)
  async function refetchOrganizationData() {
    if (Object.keys(isChanged).length === 0) return; // 변경된 값 없으면 요청 안 함

    setIsFetching(true);
    try {
      const updatedData = await fetchOrganizationDetails(organizationId);
      // 데이터가 변경되지 않더라도 리렌더링을 강제하기 위해 새로운 객체로 할당
      setFormData({ ...updatedData });
      // 유효성 검사 실행 (버튼 활성화 여부 및 에러 메시지 갱신)
      validateInputs();
      setIsChanged({}); // 모든 필드 변경 상태 초기화
    } catch (error) {
      // "업체 데이터 갱신 실패:"
    } finally {
      setIsFetching(false);
    }
  }

  // 입력 값 유효성 검사
  function validateInputs() {
    // `Object.entries()`를 사용하여 모든 필드에 대한 유효성 검사 수행
    const updatedErrors = Object.entries(validationRulesOfOrganization).reduce(
      (errors, [inputName, validationRule]) => {
        if (
          !validationRule.isValid(
            formData?.[inputName as keyof OrganizationProps] ?? "",
          )
        ) {
          errors[inputName as keyof OrganizationProps] =
            validationRule.errorMessage;
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
    // 숫자만 남기기
    let formattedValue = value;

    if (inputName === "phoneNumber" || inputName === "brNumber") {
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

      if (inputName === "phoneNumber") {
        formattedValue = formatWithHyphen(onlyNumbers, [3, 4, 4]); // 010-1234-5678
      } else if (inputName === "brNumber") {
        formattedValue = formatWithHyphen(onlyNumbers, [3, 2, 5]); // 123-45-67890
      }
    }

    // 상태 업데이트 (주소 입력란은 원본 값 유지)
    setFormData((prev) => ({
      ...prev,
      [inputName]: formattedValue,
    }));

    // 변경된 상태 추적
    setIsChanged((prev) => ({
      ...prev,
      [inputName]: true,
    }));
  }

  // updateOrganization()을 호출하여 업체 정보를 수정
  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    if (!validateInputs()) {
      alert("입력값을 다시 확인해주세요.");
      setIsSubmitting(false);
      return;
    }

    const organizationData = {
      type: formData.type,
      name: formData.name,
      brNumber: formData.brNumber,
      brCertificateUrl: formData.brCertificateUrl,
      streetAddress: formData.streetAddress,
      detailAddress: formData.detailAddress,
      phoneNumber: formData.phoneNumber,
    };
    const response = await updateOrganization(
      organizationId,
      organizationData,
      selectedFile,
    );
    // 요청 실패 시 즉시 리턴
    if (response === null) return;

    // 수정된 데이터만 렌더링
    refetchOrganizationData();
    setIsChanged({}); // 모든 필드 변경 상태 및 스타일 초기화
    setIsSubmitting(false);
  }

  // 업체 삭제 - 탈퇴 사유 입력 ver.
  async function handleDelete(deleteReason: string) {
    await deleteOrganization(organizationId, deleteReason); // 탈퇴 사유 입력값 전달
    route.push("/admin/organizations"); // 삭제 후 목록 페이지(회원 관리)로 이동
  }

  return (
    <>
      <InputFormLayout
        title="업체 상세 조회"
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
        isDisabled={isUpdateDisabled} // 버튼 비활성화 조건 추가
        onDelete={handleDelete}
        deleteEntityType="업체" // 삭제 대상 선택 ("회원" | "업체" | "프로젝트")
      >
        <Flex direction="column" gap="0.1rem">
          {/* 수정 불가 필드 (업체 유형) */}
          <Flex gap={4} align="center">
            <Box>
              <Flex direction="row" align="center" mb={4}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#4A5568",
                    marginRight: "2rem",
                  }}
                >
                  업체 유형을 선택하세요
                </span>
                <RadioGroup value={formData.type} disabled>
                  <HStack gap={6}>
                    <Radio value="CUSTOMER" disabled>
                      고객사
                    </Radio>
                    <Radio value="DEVELOPER" disabled>
                      개발사
                    </Radio>
                  </HStack>
                </RadioGroup>
              </Flex>
            </Box>
          </Flex>
          {/* 업체명 (수정 불가) */}
          <Flex gap={4} align="center">
            <Box flex="2">
              <InputForm
                id="name"
                type="text"
                label="업체명"
                value={formData.name}
                disabled
              />
            </Box>
            {/* 대표자 연락처 입력 */}
            <Box flex="1">
              <InputForm
                id="phoneNumber"
                type="tel"
                label="대표자 연락처"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputUpdate("phoneNumber", e.target.value)
                }
                error={errors.phoneNumber ?? undefined} // 에러 null 값을 undefined로 변환 (이하 동일)
                isChanged={!!isChanged["phoneNumber"]}
              />
            </Box>
            <Box flex="1"></Box>
          </Flex>
          {/* 대표자 연락처 및 사업자 등록증 첨부 */}
          <Flex gap={4} align="center">
            {/* 사업자 등록번호 입력 */}
            <Box flex="1">
              <InputForm
                id="brNumber"
                type="text"
                label="사업자 등록번호"
                placeholder="ex) 123-45-67890"
                value={formData.brNumber}
                error={errors.brNumber ?? undefined} // 에러 null 값을 undefined로 변환 (이하 동일)
                onChange={(e) => handleInputUpdate("brNumber", e.target.value)}
                isChanged={!!isChanged["brNumber"]}
              />
            </Box>
            {/* 사업자 등록증 파일 첨부 */}
            <Box flex="1" className={styles.inputFieldContainer}>
              <label htmlFor="businessLicense" className={styles.label}>
                사업자 등록증 첨부
              </label>
              <>
                <div className={styles.fileUploadContainer}>
                  {/* 파일 첨부 버튼 */}
                  <input
                    type="file"
                    id="businessLicense"
                    className={styles.fileInputHidden}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        setFormData((prev) => ({
                          ...prev,
                          brCertificateUrl: `${file.name}|${URL.createObjectURL(file)}`,
                        }));
                        // 파일이 변경된 경우 isChanged에 반영
                        setIsChanged((prev) => ({
                          ...prev,
                          brCertificateUrl: true, // 파일 변경 감지 추가
                        }));
                      }
                    }}
                  />
                  <label
                    htmlFor="businessLicense"
                    className={styles.fileUploadButton}
                  >
                    파일 첨부
                  </label>
                  {/* 파일명 출력 및 클릭 시 새 탭에서 열기 */}
                  {formData.brCertificateUrl ? (
                    (() => {
                      const fileData =
                        typeof formData.brCertificateUrl === "string" &&
                        formData.brCertificateUrl.includes("|")
                          ? formData.brCertificateUrl.split("|")
                          : [formData.brCertificateUrl, null];

                      const fileName = fileData[0]
                        ? fileData[0].replace(/^\d+_/, "")
                        : "파일을 선택하세요";
                      const fileUrl = fileData[1] || formData.brCertificateUrl;

                      return fileUrl ? (
                        <a
                          href={fileUrl.split("|").pop()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.selectedFileName}
                        >
                          ✔ {fileName}
                        </a>
                      ) : (
                        <span
                          className={styles.selectedFileName}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          ✔ {fileName}
                        </span>
                      );
                    })()
                  ) : (
                    <span
                      className={styles.selectedFileName}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      파일을 선택하세요
                    </span>
                  )}
                </div>
              </>
              <span className={styles.errorText}> </span>
            </Box>
          </Flex>
          {/* 사업장 주소 조회 및 입력 */}
          <Flex gap={4} align="center">
            <Box flex="1">
              <InputForm
                id="streetAddress"
                type="address"
                label="사업장 도로명 주소"
                value={formData.streetAddress}
                onChange={(e) =>
                  handleInputUpdate("streetAddress", e.target.value)
                }
                error={errors.streetAddress ?? undefined} // 에러 null 값을 undefined로 변환 (이하 동일)
                isChanged={!!isChanged["streetAddress"]}
              />
            </Box>
            {/* 사업장 주소 상세 입력 */}
            <Box flex="1">
              <InputForm
                id="detailAddress"
                type="text"
                label="사업장 상세 주소"
                value={formData.detailAddress}
                onChange={(e) =>
                  handleInputUpdate("detailAddress", e.target.value)
                }
                error={errors.detailAddress ?? undefined} // 에러 null 값을 undefined로 변환 (이하 동일)
                isChanged={!!isChanged["detailAddress"]}
              />
            </Box>
          </Flex>
          <Flex gap={4} align="center"></Flex>
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
          <Tabs.RootProvider value={tabs}>
            <Tabs.List>
              <Tabs.Trigger
                value="members"
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("tab", "members"); // 탭 값만 유지, 나머지 초기화
                  const newUrl = `?${params.toString()}`;
                  window.history.replaceState(null, "", newUrl); // 히스토리에 추가
                  route.push(newUrl);
                }}
                _selected={{ color: "#00a8ff" }}
              >
                <LuUser />
                소속 회원
              </Tabs.Trigger>
              <Tabs.Trigger
                value="projects"
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("tab", "projects"); // 탭 값만 유지, 나머지 초기화
                  const newUrl = `?${params.toString()}`;
                  window.history.replaceState(null, "", newUrl); // 히스토리에 추가
                  route.push(newUrl);
                }}
                _selected={{ color: "#00a8ff" }}
              >
                <LuFolder />
                참여 중 프로젝트
              </Tabs.Trigger>
            </Tabs.List>

            <Suspense>
              <Tabs.Content value="members">
                {/* 업체 별 소속 회원 목록 조회 */}
                <OrganizationMemberList organizationId={organizationId} />
              </Tabs.Content>
              <Tabs.Content value="projects">
                {/* 업체 별 참여 중 프로젝트 목록 조회 */}
                <OrganizationProjectList organizationId={organizationId} />
              </Tabs.Content>
            </Suspense>
          </Tabs.RootProvider>
        </Box>
      </Stack>
    </>
  );
}

// 업체 별 소속 회원 목록 조회
function OrganizationMemberList({
  organizationId,
}: {
  organizationId: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams?.get("keyword") || "";
  const memberRole = searchParams?.get("memberRole") || "";
  const memberStatus = searchParams?.get("memberStatus") || "";
  const currentPage = parseInt(searchParams?.get("currentPage") || "1", 10);
  const memberPageSize = parseInt(
    searchParams?.get("memberPageSize") || "10",
    5,
  );

  const {
    data: memberList,
    paginationInfo,
    loading: memberListLoading,
    error: memberListError,
    refetch,
  } = useOrganizationMemberList(
    organizationId,
    keyword,
    memberRole,
    memberStatus,
    currentPage,
    memberPageSize,
  );

  // 상태 변경을 위한 로컬 상태 추가
  const [memberData, setMemberData] = useState<MemberProps[]>([]);
  const { mutate: activateMember, error: memberActiveError } =
    useActivateMemberStatus();
  const { mutate: deactivateMember, error: memberDeactiveError } =
    useDeactivateMemberStatus();
  const { mutate: deleteMember, error: MemberDeleteError } = useDeleteMember();

  useEffect(() => {
    if (memberList) {
      setMemberData(memberList);
    }
  }, [memberList]);

  const [loadingId, setLoadingId] = useState<string | null>(null); // 특정 회원의 Switch 로딩 상태

  // 회원 상태 변경 핸들러 (API 호출 및 UI 반영)
  const handleStatusChange = async (
    memberId: string,
    currentStatus: string,
  ) => {
    setLoadingId(memberId); // 변경 중인 ID 설정 (로딩 표시)
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    // UI를 먼저 업데이트하여 즉각적인 피드백 제공
    setMemberData((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId ? { ...member, status: newStatus } : member,
      ),
    );

    if (currentStatus === "ACTIVE") {
      deactivateMember(memberId); // 비활성화 API 호출
    } else {
      activateMember(memberId); // 활성화 API 호출
    }

    setTimeout(() => {
      refetch();
    }, 500);

    setLoadingId(null);
  };

  const handleMemberPageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    // 쿼리스트링 업데이트
    params.set("currentPage", page.toString());
    // URL 업데이트
    router.push(`?${params.toString()}`);
  };

  const handleRowClick = (memberId: string) => {
    const member = memberList?.find((m) => m.id === memberId);
    if (member) {
      router.push(`/admin/members/${member.id}`);
    }
  };

  const handleEdit = (memberId: string) => {
    const member = memberList?.find((m) => m.id === memberId);
    if (member) {
      router.push(`/admin/members/${member.id}`);
    }
  };

  const handleDelete = async (memberId: string) => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;
    const response = await deleteMember(memberId, ""); // 탈퇴 사유 입력값 전달
    if (response === null) return;
    refetch();
  };

  return (
    <>
      <Stack width="full">
        <Flex justifyContent="end">
          {/* 회원 검색/필터 섹션 (검색창, 필터 옵션 등) */}
          <SearchSection
            keyword={keyword}
            placeholder="회원명 입력"
            keywordName="keyword"
            currentPageName="currentPage"
          >
            <FilterSelectBox
              statusFramework={memberRoleFramework}
              selectedValue={memberRole}
              placeholder="역할"
              queryKey="memberRole"
              width="100px"
            />
            <FilterSelectBox
              statusFramework={memberStatusFramework}
              selectedValue={memberStatus}
              placeholder="회원 상태"
              queryKey="memberStatus"
              width="120px"
            />
          </SearchSection>
        </Flex>
        {memberListError && (
          <ErrorAlert message="회원 목록을 불러오지 못했습니다. 다시 시도해주세요." />
        )}
        <CommonTable
          columnsWidth={
            <>
              <Table.Column htmlWidth="10%" />
              <Table.Column htmlWidth="15%" />
              <Table.Column htmlWidth="15%" />
              <Table.Column htmlWidth="15%" />
              <Table.Column htmlWidth="12%" />
              <Table.Column htmlWidth="10%" />
              <Table.Column htmlWidth="10%" />
              <Table.Column htmlWidth="10%" />
            </>
          }
          headerTitle={
            <Table.Row
              backgroundColor={"#eee"}
              css={{
                "& > th": { textAlign: "center" },
              }}
            >
              <Table.ColumnHeader>역할</Table.ColumnHeader>
              <Table.ColumnHeader>회원명</Table.ColumnHeader>
              <Table.ColumnHeader>직무 | 직책</Table.ColumnHeader>
              <Table.ColumnHeader>이메일</Table.ColumnHeader>
              <Table.ColumnHeader>연락처</Table.ColumnHeader>
              <Table.ColumnHeader>등록일</Table.ColumnHeader>
              <Table.ColumnHeader>활성화 여부</Table.ColumnHeader>
              <Table.ColumnHeader>관리</Table.ColumnHeader>
            </Table.Row>
          }
          data={memberList || []}
          loading={memberListLoading}
          renderRow={(member) => {
            return (
              <Table.Row
                key={member.id}
                onClick={() => handleRowClick(member.id)}
                css={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  "& > td": {
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              >
                <Table.Cell>
                  {ROLE_LABELS[member.role] || "알 수 없음"}
                </Table.Cell>
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>{`${member.jobRole} | ${member.jobTitle}`}</Table.Cell>
                <Table.Cell>{member.email}</Table.Cell>
                <Table.Cell>{member.phoneNum}</Table.Cell>
                <Table.Cell>{(member.regAt ?? "-").split(" ")[0]}</Table.Cell>
                <Table.Cell onClick={(event) => event.stopPropagation()}>
                  {member.status === "DELETED" ? (
                    <Text color="red">삭제됨</Text>
                  ) : (
                    <Switch
                      checked={member.status === "ACTIVE"}
                      onChange={(event) => {
                        event.stopPropagation();
                        handleStatusChange(member.id, member.status);
                      }}
                      disabled={loadingId === member.id} // 상태 변경 시 로딩 적용
                    />
                  )}
                </Table.Cell>
                <Table.Cell onClick={(event) => event.stopPropagation()}>
                  <DropDownMenu
                    onEdit={() => handleEdit(member.id)}
                    onDelete={() => handleDelete(member.id)}
                  />
                </Table.Cell>
              </Table.Row>
            );
          }}
        />
        {/*
         * 페이지네이션 컴포넌트
         * paginationInfo: 현재 페이지, 총 페이지, 페이지 크기 등의 정보
         * handleMemberPageChange: 페이지 이동 시 실행될 콜백
         */}
        <Pagination
          paginationInfo={
            paginationInfo && {
              ...paginationInfo,
              currentPage: paginationInfo.currentPage,
            }
          }
          handlePageChange={handleMemberPageChange}
        />
      </Stack>
    </>
  );
}

// 업체 별 참여 중 프로젝트 목록 조회
function OrganizationProjectList({
  organizationId,
}: {
  organizationId: string;
}) {
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
  } = useOrganizationProjectList(
    organizationId,
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
        <Flex justifyContent="end">
          {/* 프로젝트 검색/필터 섹션 (검색창, 필터 옵션 등) */}
          <SearchSection keyword={keyword} placeholder="프로젝트명 입력">
            <FilterSelectBox
              statusFramework={projectStatusFramework}
              selectedValue={managementStep}
              placeholder="관리단계"
              queryKey="managementStep"
              width="150px"
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
              backgroundColor={"#eee"}
              css={{
                "& > th": { textAlign: "center" },
              }}
            >
              <Table.ColumnHeader>프로젝트명</Table.ColumnHeader>
              <Table.ColumnHeader>고객사</Table.ColumnHeader>
              <Table.ColumnHeader>개발사</Table.ColumnHeader>
              <Table.ColumnHeader>관리 단계</Table.ColumnHeader>
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
                <Table.Cell>
                  {(project.startAt ?? "-").split(" ")[0]}
                </Table.Cell>
                <Table.Cell>
                  {(project.deadlineAt ?? "-").split(" ")[0]}
                </Table.Cell>
                <Table.Cell>
                  {project.closeAt.split(" ")[0] === ""
                    ? "-"
                    : project.closeAt.split(" ")[0]}
                </Table.Cell>
              </Table.Row>
            );
          }}
        />
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
