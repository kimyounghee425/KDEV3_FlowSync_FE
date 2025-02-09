"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  // ✅ 각 필드별 변경 상태를 관리하는 객체
  const [isChanged, setIsChanged] = useState<{ [key: string]: boolean }>({});
  const isUpdateDisabled =
    Object.values(isChanged).every((changed) => !changed) ||
    Object.keys(errors).length > 0;

  // 🔹 formData가 변경될 때만 실행되도록 설정
  useEffect(() => {
    validateInputs();
  }, [formData]);

  // 📌 회원 데이터 다시 불러오기 (업데이트 후)
  async function refetchMemberData() {
    if (Object.keys(isChanged).length === 0) return; // 🔥 변경된 값 없으면 요청 안 함

    setIsFetching(true);
    try {
      const updatedData = await fetchMemberDetails(memberId);
      // ✅ 데이터가 변경되지 않더라도 리렌더링을 강제하기 위해 새로운 객체로 할당
      setFormData({ ...updatedData });
      // ✅ 유효성 검사 실행 (버튼 활성화 여부 및 에러 메시지 갱신)
      validateInputs();
      setIsChanged({}); // ✅ 모든 필드 변경 상태 초기화
    } catch (error) {
      console.error("회원 데이터 갱신 실패:", error);
    } finally {
      setIsFetching(false);
    }
  }

  function validateInputs() {
    // 🔹 `Object.entries()`를 사용하여 모든 필드에 대한 유효성 검사 수행
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

  // 📌 입력 값 변경 시 상태(formData)를 업데이트.
  function handleInputUpdate(inputName: string, value: string) {
    // 숫자만 남기기
    let formattedValue = value;

    if (inputName === "phoneNum") {
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

      if (inputName === "phoneNum") {
        formattedValue = formatWithHyphen(onlyNumbers, [3, 4, 4]); // 010-1234-5678
      }
    }

    // 🔹 상태 업데이트 (주소 입력란은 원본 값 유지)
    setFormData((prev) => ({
      ...prev,
      [inputName]: formattedValue,
    }));

    // 🔹 변경된 상태 추적
    setIsChanged((prev) => {
      if (!prev[inputName]) {
        return { ...prev, [inputName]: true };
      }
      return prev;
    });
  }

  // 📌 회원 정보 수정
  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    if (!validateInputs()) {
      alert("입력값을 다시 확인해주세요.");
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
      alert("회원 정보가 수정되었습니다.");
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
      alert("회원 삭제에 실패했습니다.");
    }
  }

  return (
    <>
      <InputFormLayout
        title="▹ 회원 상세 조회"
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
        isDisabled={isUpdateDisabled} // 버튼 비활성화 조건 추가
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
          error={errors.name ?? undefined} // 에러 값이 null 이면 안돼서 undefined로 변환 (이하 동일)
          onChange={(e) => handleInputUpdate("name", e.target.value)}
          isChanged={!!isChanged["name"]}
        />
        <InputForm
          id="phoneNum"
          type="tel"
          label="연락처"
          value={formData.phoneNum}
          error={errors.phoneNum ?? undefined}
          onChange={(e) => handleInputUpdate("phoneNum", e.target.value)}
          isChanged={!!isChanged["phoneNum"]}
        />
        <InputForm
          id="jobRole"
          type="text"
          label="직무"
          value={formData.jobRole}
          error={errors.jobRole ?? undefined}
          onChange={(e) => handleInputUpdate("jobRole", e.target.value)}
          isChanged={!!isChanged["jobRole"]}
        />
        <InputForm
          id="jobTitle"
          type="text"
          label="직함"
          value={formData.jobTitle}
          error={errors.jobTitle ?? undefined}
          onChange={(e) => handleInputUpdate("jobTitle", e.target.value)}
          isChanged={!!isChanged["jobTitle"]}
        />
        <InputForm
          id="introduction"
          type="text"
          label="회원 소개"
          value={formData.introduction}
          error={errors.introduction ?? undefined}
          onChange={(e) => handleInputUpdate("introduction", e.target.value)}
          isChanged={!!isChanged["introduction"]}
        />
        <InputForm
          id="remark"
          type="text"
          label="특이사항"
          value={formData.remark}
          error={errors.remark ?? undefined}
          onChange={(e) => handleInputUpdate("remark", e.target.value)}
          isChanged={!!isChanged["remark"]}
        />
      </InputFormLayout>
    </>
  );
}
