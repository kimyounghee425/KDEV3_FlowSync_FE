import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { OrganizationProps } from "@/src/types/organization";
import { fetchOrganizations } from "@/src/api/organizations";
import { MemberResponseType } from "@/src/types/api";

export function useOrganizationList() {
  const [organizationList, setOrganizationList] = useState<OrganizationProps[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";
  const filter = searchParams?.get("filter") || "";

  const fetchMemberList = useCallback(
    async (currentPage: number = 1, pageSize: number = 5) => {
      setLoading(true);
      try {
        const response: MemberResponseType<{ members: OrganizationProps[] }> =
          await fetchOrganizations(query, filter, currentPage - 1, pageSize);
        setOrganizationList(response.data.members);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [query, filter],
  );

  useEffect(() => {
    fetchMemberList();
    console.log("시작할 때 딱 1번만 실행");
  }, [fetchMemberList]);

  return {
    query,
    filter,
    organizationList,
    loading,
    fetchOrganizations,
  };
}
