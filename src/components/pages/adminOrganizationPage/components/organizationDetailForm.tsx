"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import InputForm from "@/src/components/common/InputForm";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import { OrganizationProps } from "@/src/types";
import { validationRulesOfUpdatingMember } from "@/src/constants/validationRules"; // 유효성 검사 규칙 import
import {
  deleteOrigination,
  deleteOriginationWithReason,
  fetchOrganizationDetails,
  updateOrganization,
} from "@/src/api/organizations";

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
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({}); // 유효성 검사 에러 상태
  const [isFetching, setIsFetching] = useState<boolean>(false); // ✅ 새로 렌더링 여부

  // 📌 업체 데이터 다시 불러오기 (업데이트 후)
  async function refetchOrganizationData() {
    setIsFetching(true);
    try {
      const updatedData = await fetchOrganizationDetails(organizationId);
      setFormData(updatedData); // ✅ 새로 불러온 데이터로 상태 업데이트
    } catch (error) {
      console.error("업체 데이터 갱신 실패:", error);
    } finally {
      setIsFetching(false);
    }
  }

  // 📌 입력값 변경 처리 및 유효성 검사 실행
  function handleChange(field: keyof OrganizationProps, value: string) {
    // field: OrganizationProps의 key, value: string
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 유효성 검사 규칙이 있는 필드만 검사
    if (field in validationRulesOfUpdatingMember) {
      const isValid =
        validationRulesOfUpdatingMember[
          field as keyof typeof validationRulesOfUpdatingMember
        ].isValid(value);
      setErrors((prev) => ({
        ...prev,
        [field]: isValid
          ? null
          : validationRulesOfUpdatingMember[
              field as keyof typeof validationRulesOfUpdatingMember
            ].errorMessage,
      }));
    }
  }

  // 📌 전체 입력값 유효성 검사 (수정 버튼 활성화 여부 체크)
  function isFormValid() {
    return Object.values(errors).every((error) => !error);
  }

  // 📌 업체 정보 수정
  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    if (!isFormValid()) {
      alert("입력값을 다시 확인해주세요.");
      setIsSubmitting(false);
      return;
    }

    try {
      await updateOrganization(organizationId, {
        brNumber: formData.brNumber,
        brCertificateUrl: formData.brCertificateUrl,
        streetAddress: formData.streetAddress,
        detailAddress: formData.detailAddress,
        phoneNumber: formData.phoneNumber,
      });
      alert("업체 정보가 수정되었습니다.");
      // #TODO 업데이트 방법1) 수정 후 최신 데이터만 렌더링 (-> 변경된 필드 초록색으로 변한 게 그대로 유지되는 문제)
      // await refetchMemberData();
      // #TODO 업데이트 방법2) 페이지 전체 새로고침 (-> 속도 느리고, 화면 깜빡여서 fetch만 하는 방향으로 수정되어야 함)
      window.location.reload();
      // #TODO 업데이트 방법3) 페이지 전체 새로고침 없이 데이터만 새로고침 (-> 변경된 필드 초록색 스타일 그대로 유지되는 문제)
      // route.refresh();    } catch (error) {
      alert("수정 실패: 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // 📌 업체 삭제 - 탈퇴 사유 입력 X
  async function handleDelete() {
    try {
      const response = await deleteOrigination(organizationId); // 탈퇴 사유 입력값 전달
      console.log("업체 삭제 API 호출 반환값 - response: ", response);
      alert("업체가 삭제 조치 되었습니다.");
      route.push("/admin/originations"); // 삭제 후 목록 페이지(회원 관리)로 이동
    } catch (error) {
      console.error("업체 삭제 중 오류 발생:", error);
      alert("업체 삭제에 실패했습니다.");
    }
  }

  // 📌 업체 삭제 - 탈퇴 사유 입력 ver.
  // async function handleDelete(deleteReason: string) {
  //   if (!deleteReason.trim()) {
  //     alert("탈퇴 사유를 입력해주세요.");
  //     return;
  //   }

  //   try {
  //     await deleteOriginationWithReason(organizationId, deleteReason); // 탈퇴 사유 입력값 전달
  //     alert("업체가 삭제 조치 되었습니다.");
  //     route.push("/admin/originations"); // 삭제 후 목록 페이지(회원 관리)로 이동
  //   } catch (error) {
  //     console.error("업체 삭제 중 오류 발생:", error);
  //     alert("업체 삭제에 실패했습니다.");
  //   }
  // }

  return (
    <>
      <InputFormLayout
        title="▹ 업체 상세 조회"
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
        onDelete={handleDelete}
        deleteEntityType="업체" // 삭제 대상 선택 ("회원" | "업체" | "프로젝트")
      >
        {/* 수정 불가 필드 */}
        <InputForm
          id="type"
          type="text"
          label="업체 유형"
          value={formData.type}
          disabled
        />
        <InputForm
          id="name"
          type="text"
          label="업체명"
          value={formData.name}
          disabled
        />
        {/* 수정 가능 필드 */}
        <InputForm
          id="brNumber"
          type="text"
          label="사업자 등록번호"
          value={formData.brNumber}
          onChange={(e) => handleChange("brNumber", e.target.value)}
          error={errors.brNumber ?? undefined} // 에러 null 값을 undefined로 변환 (이하 동일)
        />
        <InputForm
          id="brCertificateUrl"
          type="text"
          label="회사 URL"
          value={formData.brCertificateUrl}
          onChange={(e) => handleChange("brCertificateUrl", e.target.value)}
          error={errors.brCertificateUrl ?? undefined} // 에러 null 값을 undefined로 변환 (이하 동일)
        />
        <InputForm
          id="streetAddress"
          type="text"
          label="사업장 도로명 주소"
          value={formData.streetAddress}
          onChange={(e) => handleChange("streetAddress", e.target.value)}
          error={errors.streetAddress ?? undefined} // 에러 null 값을 undefined로 변환 (이하 동일)
        />
        <InputForm
          id="detailAddress"
          type="text"
          label="사업장 상세 주소"
          value={formData.detailAddress}
          onChange={(e) => handleChange("detailAddress", e.target.value)}
          error={errors.detailAddress ?? undefined} // 에러 null 값을 undefined로 변환 (이하 동일)
        />
        <InputForm
          id="phoneNumber"
          type="tel"
          label="대표자 연락처"
          value={formData.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          error={errors.phoneNumber ?? undefined} // 에러 null 값을 undefined로 변환 (이하 동일)
        />
      </InputFormLayout>
    </>
  );
}
