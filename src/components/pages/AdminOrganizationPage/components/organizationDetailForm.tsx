"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Box, Flex, HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/src/components/ui/radio";
import InputForm from "@/src/components/common/InputForm";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import { OrganizationProps } from "@/src/types";
import {
  deleteOriginationWithReason,
  fetchOrganizationDetails,
  updateOrganization,
} from "@/src/api/organizations";
import styles from "@/src/components/common/InputForm.module.css";
import { validationRulesOfUpdatingOrganization } from "@/src/constants/validationRules";

export default function OrganizationDetailForm({
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
  const [isFetching, setIsFetching] = useState<boolean>(false); // ✅ 새로 렌더링 여부
  // ✅ 각 필드별 변경 상태를 관리하는 객체
  const [isChanged, setIsChanged] = useState<{ [key: string]: boolean }>({});
  const isUpdateDisabled =
    Object.keys(isChanged).length === 0 || Object.keys(errors).length > 0;
  const fileData =
    typeof formData.brCertificateUrl === "string" &&
    formData.brCertificateUrl.includes("|")
      ? formData.brCertificateUrl.split("|")
      : [null, null];

  // 🔹 formData가 변경될 때만 실행되도록 설정
  useEffect(() => {
    validateInputs();
  }, [formData]);

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

  // 📌 업체 데이터 다시 불러오기 (업데이트 후)
  async function refetchOrganizationData() {
    if (Object.keys(isChanged).length === 0) return; // 🔥 변경된 값 없으면 요청 안 함

    setIsFetching(true);
    try {
      const updatedData = await fetchOrganizationDetails(organizationId);
      // ✅ 데이터가 변경되지 않더라도 리렌더링을 강제하기 위해 새로운 객체로 할당
      setFormData({ ...updatedData });
      // ✅ 유효성 검사 실행 (버튼 활성화 여부 및 에러 메시지 갱신)
      validateInputs();
      setIsChanged({}); // ✅ 모든 필드 변경 상태 초기화
    } catch (error) {
      console.error("업체 데이터 갱신 실패:", error);
    } finally {
      setIsFetching(false);
    }
  }

  function validateInputs() {
    // 🔹 `Object.entries()`를 사용하여 모든 필드에 대한 유효성 검사 수행
    const updatedErrors = Object.entries(
      validationRulesOfUpdatingOrganization,
    ).reduce(
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

  // 📌 입력 값 변경 시 상태(formData)를 업데이트.
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
          if (index >= value.length) break; // 🔥 안전한 길이 체크 추가
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

    // 🔹 상태 업데이트 (주소 입력란은 원본 값 유지)
    setFormData((prev) => ({
      ...prev,
      [inputName]: formattedValue,
    }));

    // 🔹 변경된 상태 추적
    setIsChanged((prev) => ({
      ...prev,
      [inputName]: true,
    }));
  }

  // 📌 updateOrganization()을 호출하여 업체 정보를 수정
  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    if (!validateInputs()) {
      alert("입력값을 다시 확인해주세요.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await updateOrganization(
        organizationId,
        {
          type: formData.type,
          name: formData.name,
          brNumber: formData.brNumber,
          brCertificateUrl: formData.brCertificateUrl,
          streetAddress: formData.streetAddress,
          detailAddress: formData.detailAddress,
          phoneNumber: formData.phoneNumber,
        },
        selectedFile,
      );

      // 수정된 데이터만 렌더링
      refetchOrganizationData();
      setIsChanged({}); // 모든 필드 변경 상태 및 스타일 초기화
      alert("업체 정보가 수정되었습니다.");
    } catch (error) {
      alert("수정 실패: 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // 📌 업체 삭제 - 탈퇴 사유 입력 ver.
  async function handleDelete(deleteReason: string) {
    if (!deleteReason.trim()) {
      alert("탈퇴 사유를 입력해주세요.");
      return;
    }
    try {
      await deleteOriginationWithReason(organizationId, deleteReason); // 탈퇴 사유 입력값 전달
      alert("업체가 삭제 조치 되었습니다.");
      route.push("/admin/organizations"); // 삭제 후 목록 페이지(회원 관리)로 이동
    } catch (error) {
      alert("업체 삭제에 실패했습니다.");
    }
  }

  return (
    <>
      <InputFormLayout
        title="▹ 업체 상세 조회"
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
        isDisabled={isUpdateDisabled} // 버튼 비활성화 조건 추가
        onDelete={handleDelete}
        deleteEntityType="업체" // 삭제 대상 선택 ("회원" | "업체" | "프로젝트")
      >
        {/* 수정 불가 필드 */}
        <Box>
          <Flex direction="row" align="center" mb={4}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#4A5568",
              }}
            >
              업체 유형을 선택하세요
            </span>
            <span
              style={{ color: "red", marginLeft: "4px", marginRight: "24px" }}
            >
              *
            </span>
            <RadioGroup
              value={formData.type}
              onValueChange={(e) => handleInputUpdate("type", e.value)}
            >
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
        <InputForm
          id="name"
          type="text"
          label="업체명"
          value={formData.name}
          disabled
        />
        {/* 수정 가능 필드 */}
        <Flex gap={4} align="center">
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
          <Box flex="1" className={styles.inputFieldContainer}>
            <label htmlFor="businessLicense" className={styles.label}>
              사업자 등록증 첨부
              <span className={styles.required}>*</span>
            </label>
            <>
              <div className={styles.fileUploadContainer}>
                {/* ✅ 파일 첨부 버튼 */}
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
        <InputForm
          id="streetAddress"
          type="address"
          label="사업장 도로명 주소"
          value={formData.streetAddress}
          onChange={(e) => handleInputUpdate("streetAddress", e.target.value)}
          error={errors.streetAddress ?? undefined} // 에러 null 값을 undefined로 변환 (이하 동일)
          isChanged={!!isChanged["streetAddress"]}
        />
        <InputForm
          id="detailAddress"
          type="text"
          label="사업장 상세 주소"
          value={formData.detailAddress}
          onChange={(e) => handleInputUpdate("detailAddress", e.target.value)}
          error={errors.detailAddress ?? undefined} // 에러 null 값을 undefined로 변환 (이하 동일)
          isChanged={!!isChanged["detailAddress"]}
        />
        <InputForm
          id="phoneNumber"
          type="tel"
          label="대표자 연락처"
          value={formData.phoneNumber}
          onChange={(e) => handleInputUpdate("phoneNumber", e.target.value)}
          error={errors.phoneNumber ?? undefined} // 에러 null 값을 undefined로 변환 (이하 동일)
          isChanged={!!isChanged["phoneNumber"]}
        />
      </InputFormLayout>
    </>
  );
}
