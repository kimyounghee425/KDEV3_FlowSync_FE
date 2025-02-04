"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import InputForm from "@/src/components/common/InputForm";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import { MemberProps } from "@/src/types";
import {
  deleteMember,
  fetchMemberDetails,
  updateMember,
} from "@/src/api/members";
import { validationRulesOfUpdatingMember } from "@/src/constants/validationRules"; // 유효성 검사 규칙 import

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
  const [isFetching, setIsFetching] = useState<boolean>(false); // ✅ 새로 렌더링 여부

  // 📌 회원 데이터 다시 불러오기 (업데이트 후)
  async function refetchMemberData() {
    setIsFetching(true);
    try {
      const updatedData = await fetchMemberDetails(memberId);
      setFormData(updatedData); // ✅ 새로 불러온 데이터로 상태 업데이트
    } catch (error) {
      console.error("회원 데이터 갱신 실패:", error);
    } finally {
      setIsFetching(false);
    }
  }
  
  // 📌 입력값 변경 처리 및 유효성 검사 실행
  function handleChange(field: keyof MemberProps, value: string) {
    let formattedValue = value;

  if (field === "phoneNum") {
    const onlyNumbers = value.replace(/[^0-9]/g, "").slice(0, 11);
    formattedValue = onlyNumbers;

    if (onlyNumbers.length > 3 && onlyNumbers.length <= 7) {
      formattedValue = `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
    } else if (onlyNumbers.length > 7) {
      formattedValue = `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
    }
  }

  setFormData((prev) => ({
    ...prev,
    [field]: formattedValue,
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

  // 📌 회원 정보 수정
  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    if (!isFormValid()) {
      alert("입력값을 다시 확인해주세요.");
      setIsSubmitting(false);
      return;
    }

    try {
      await updateMember(memberId, {
        name: formData.name,
        phoneNum: formData.phoneNum,
        jobRole: formData.jobRole,
        jobTitle: formData.jobTitle,
        introduction: formData.introduction,
        remark: formData.remark,
      });
      alert("회원 정보가 수정되었습니다.");
      // #TODO 업데이트 방법1) 수정 후 최신 데이터만 렌더링 (-> 변경된 필드 초록색으로 변한 게 그대로 유지되는 문제)
      // await refetchMemberData();
      // #TODO 업데이트 방법2) 페이지 전체 새로고침 (-> 속도 느리고, 화면 깜빡여서 fetch만 하는 방향으로 수정되어야 함)
      window.location.reload();
      // #TODO 업데이트 방법3) 페이지 전체 새로고침 없이 데이터만 새로고침 (-> 변경된 필드 초록색 스타일 그대로 유지되는 문제)
      // route.refresh();
    } catch (error) {
      alert("수정 실패: 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // 📌 회원 삭제 (삭제 컴포넌트(공통)는 InputFormLayout.tsx 에서 관리)
  async function handleDelete(deleteReason: string) {
    if (!deleteReason.trim()) {
      alert("탈퇴 사유를 입력해주세요.");
      return;
    }

    try {
      await deleteMember(memberId, deleteReason); // 탈퇴 사유 입력값 전달
      alert("회원이 탈퇴 조치 되었습니다.");
      route.push("/admin/members"); // 삭제 후 목록 페이지(회원 관리)로 이동
    } catch (error) {
      console.error("회원 삭제 중 오류 발생:", error);
      alert("회원 삭제에 실패했습니다.");
    }
  }

  console.log(formData.phoneNum)



  return (
    <>
      <InputFormLayout
        title="▹ 회원 상세 조회"
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
        onDelete={handleDelete}
        deleteEntityType="회원" // 삭제 대상 선택 ("회원" | "업체" | "프로젝트")
      >
        {/* 수정 불가 필드 */}
        <InputForm
          id="email"
          type="email"
          label="로그인 Email"
          value={formData.email}
          disabled
        />
        <InputForm
          id="role"
          type="text"
          label="사용자 권한"
          value={formData.role}
          disabled
        />

        {/* 수정 가능 필드 */}
        <InputForm
          id="name"
          type="text"
          label="성함"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name ?? undefined} // 에러 값이 null 이면 안돼서 undefined로 변환 (이하 동일)
        />
        <InputForm
          id="phoneNum"
          type="tel"
          label="연락처"
          value={formData.phoneNum}
          onChange={(e) => handleChange("phoneNum", e.target.value)}
          maxLength={13}
          error={errors.phoneNum ?? undefined}
        />
        <InputForm
          id="jobRole"
          type="text"
          label="직무"
          value={formData.jobRole}
          onChange={(e) => handleChange("jobRole", e.target.value)}
          error={errors.jobRole ?? undefined}
        />
        <InputForm
          id="jobTitle"
          type="text"
          label="직함"
          value={formData.jobTitle}
          onChange={(e) => handleChange("jobTitle", e.target.value)}
          error={errors.jobTitle ?? undefined}
        />
        <InputForm
          id="introduction"
          type="text"
          label="회원 소개"
          value={formData.introduction}
          onChange={(e) => handleChange("introduction", e.target.value)}
          error={errors.introduction ?? undefined}
        />
        <InputForm
          id="remark"
          type="text"
          label="특이사항"
          value={formData.remark}
          onChange={(e) => handleChange("remark", e.target.value)}
          error={errors.remark ?? undefined}
        />
      </InputFormLayout>
    </>
  );
}
