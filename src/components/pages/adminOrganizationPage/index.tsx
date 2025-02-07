"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrganizationProps } from "@/src/types";
import { fetchOrganizationDetails } from "@/src/api/organizations";
import OrganizationDetailForm from "./components/organizationDetailForm";

export default function AdminOrganizationPage() {
  const router = useRouter();
  const params = useParams();
  // organizationId를 string으로 변환하여 사용
  const organizationId = String(
    Array.isArray(params.organizationId)
      ? params.organizationId[0]
      : params.organizationId,
  );
  const [organizationData, setOrganizationData] =
    useState<OrganizationProps | null>(null);

  // URL 에 업체 아이디가 없는 경우, 404 페이지 이동
  useEffect(() => {
    if (!organizationId) {
      // router.replace("/404");
    }
  }, [organizationId, router]);

  // 🔹 업체 상세 데이터 가져오기
  useEffect(() => {
    const getOrganization = async () => {
      if (!organizationId) return; // organizationId가 없는 경우 API 호출 방지

      try {
        console.log("Fetching organization data for ID:", organizationId);
        const response = await fetchOrganizationDetails(organizationId);
        console.log("업체 데이터 fetch 결과:", response);

        // 🚀 업체 데이터가 없는 경우 404 이동
        if (!response) {
          router.replace("/404");
          return;
        }

        setOrganizationData(response);
      } catch (error) {
        console.error("업체 데이터 조회 실패:", error);
        // router.replace("/404");
      }
    };
    getOrganization();
  }, [organizationId]);

  if (!organizationData) {
    return <p>Loading...</p>;
  }

  return (
    <OrganizationDetailForm
      organizationData={organizationData}
      organizationId={organizationId as string}
    />
  );
}
