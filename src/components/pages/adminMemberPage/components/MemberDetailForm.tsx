"use client";

import { deleteMember, updateMember } from "@/src/api/members";
import InputForm from "@/src/components/common/InputForm";
import InputFormLayout from "@/src/components/layouts/InputFormLayout";
import { Radio, RadioGroup } from "@/src/components/ui/radio";
import { MemberProps } from "@/src/types";
import { Box, Flex, HStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validationRulesOfUpdatingMember } from "@/src/constants/validationRules"; // 🔹 유효성 검사 규칙 import

export default function MemberDetailForm({
  memberData,
  memberId,
}: {
  memberData: MemberProps; // ✅ 회원 상세 타입 추가
  memberId: string;
}) {
  const route = useRouter();
  const [formData, setFormData] = useState<MemberProps>(memberData); // ✅ useState에 타입 추가
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({}); // 🔹 유효성 검사 에러 상태

  // 🔹 입력값 변경 처리 및 유효성 검사 실행
  function handleChange(field: keyof MemberProps, value: string) {
    // ✅ field는 MemberProps의 key, value는 string
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // ✅ 유효성 검사 규칙이 있는 필드만 검사
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

  // 🔹 전체 입력값 유효성 검사 (수정 버튼 활성화 여부 체크)
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
    } catch (error) {
      alert("수정 실패: 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // 📌 회원 삭제
  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteMember(memberId);
      alert("회원이 삭제되었습니다.");
      route.push("/admin/members");
    } catch (error) {
      console.error("회원 삭제 중 오류 발생:", error);
      alert("회원 삭제에 실패했습니다.");
    }
  }

  return (
    <InputFormLayout
      title="▹ 회원 상세 조회"
      onSubmit={handleUpdate}
      isLoading={isSubmitting}
      onDelete={handleDelete} // ✅ 삭제 핸들러 추가
    >
      {/* ✅ 수정 불가 필드 */}
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
      {/* ✅ 수정 가능 필드 */}
      <InputForm
        id="name"
        type="text"
        label="성함"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name ?? undefined} // 🔹 null 값을 undefined로 변환
      />
      <InputForm
        id="phoneNum"
        type="tel"
        label="연락처"
        value={formData.phoneNum}
        onChange={(e) => handleChange("phoneNum", e.target.value)}
        error={errors.phoneNum ?? undefined} // 🔹 null 값을 undefined로 변환
      />
      <InputForm
        id="jobRole"
        type="text"
        label="직무"
        value={formData.jobRole}
        onChange={(e) => handleChange("jobRole", e.target.value)}
        error={errors.jobRole ?? undefined} // 🔹 null 값을 undefined로 변환
      />
      <InputForm
        id="jobTitle"
        type="text"
        label="직함"
        value={formData.jobTitle}
        onChange={(e) => handleChange("jobTitle", e.target.value)}
        error={errors.jobTitle ?? undefined} // 🔹 null 값을 undefined로 변환
      />
      <InputForm
        id="introduction"
        type="text"
        label="회원 소개"
        value={formData.introduction}
        onChange={(e) => handleChange("introduction", e.target.value)}
        error={errors.introduction ?? undefined} // 🔹 null 값을 undefined로 변환
      />
      <InputForm
        id="remark"
        type="text"
        label="특이사항"
        value={formData.remark}
        onChange={(e) => handleChange("remark", e.target.value)}
        error={errors.remark ?? undefined} // 🔹 null 값을 undefined로 변환
      />
    </InputFormLayout>
  );
}
