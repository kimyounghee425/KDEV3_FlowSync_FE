import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  OrganizationListResponse,
  OrganizationProps,
  PaginationProps,
} from "@/src/types";
import { fetchOrganizationList } from "@/src/api/organizations";
import { CommonResponseType } from "@/src/types";

export function useOrganizationList() {
  const [organizationList, setOrganizationList] = useState<OrganizationProps[]>(
    [],
  );
  const [paginationInfo, setPaginationInfo] = useState<PaginationProps>();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const keyword = searchParams?.get("keyword") || "";
  const filter = searchParams?.get("filter") || "";

  const fetchBoardList = useCallback(
    async (currentPage: number = 1, pageSize: number = 10) => {
      setLoading(true);
      try {
        const response: CommonResponseType<OrganizationListResponse> =
          await fetchOrganizationList(
            keyword,
            filter,
            currentPage - 1,
            pageSize,
          );
        setOrganizationList(response.data.organizations);
        setPaginationInfo(response.data.meta);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [keyword, filter],
  );

  useEffect(() => {
    fetchBoardList();
  }, [fetchBoardList]);

  return {
    keyword,
    filter,
    organizationList,
    paginationInfo,
    loading,
    fetchBoardList,
  };
}
