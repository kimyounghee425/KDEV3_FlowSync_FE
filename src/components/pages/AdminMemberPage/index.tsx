"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MemberDetailForm from "@/src/components/pages/AdminMemberPage/components/MemberDetailForm";
import { fetchMemberDetails } from "@/src/api/members";
import { MemberProps } from "@/src/types";
import { Loading } from "@/src/components/common/Loading";

export default function AdminMemberPage() {
  const router = useRouter();
  const params = useParams();
  // URL에서 memberId 가져오기
  // memberId를 string으로 변환
  const memberId = String(
    Array.isArray(params.memberId) ? params.memberId[0] : params.memberId,
  );
  // 초기 상태를 null로 설정하되, MemberProps | null 타입을 명시하여 타입 호환 문제 해결.
  const [memberData, setMemberData] = useState<MemberProps | null>(null);

  // memberId가 없는 경우, 404 페이지로 리다이렉트
  useEffect(() => {
    if (!memberId) {
      router.replace("/404");
    }
  }, [memberId, router]);

  // 회원 상세 데이터 가져오기
  useEffect(() => {
    const getMember = async () => {
      if (!memberId) return; // memberId가 없는 경우 API 호출 방지

      try {
        const response = await fetchMemberDetails(memberId);

        if (!response) {
          router.replace("/404"); // 데이터가 없는 경우 404 이동
          return;
        }

        setMemberData(response);
      } catch (error) {
        // "회원 데이터 조회 실패:"
        // router.replace("/404");
      }
    };
    getMember();
  }, [memberId]);

  if (!memberData) {
    return <Loading />;
  }

  return (
    <MemberDetailForm memberData={memberData} memberId={memberId as string} />
  );
}
