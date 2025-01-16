import { useSearchParams } from "next/navigation";
import { BoardResponse, PaginationInfo, ProjectProps } from "../types";
import { useCallback, useEffect, useState } from "react";
import { MemberProps } from "../types/member";
import { fetchMembers } from "../api/members";

export function useMemberList() {
  const searchParams = useSearchParams();
  const [memberList, setMemberList] = useState<MemberProps[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>();
  const [loading, setLoading] = useState(false);
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || "";

  const fetchMemberList = useCallback(
    async (currentPage: number = 1, pageSize: number = 5) => {
      setLoading(true);
      try {
        const response: BoardResponse<MemberProps> = await fetchMembers(query, filter, currentPage - 1, pageSize);
        setMemberList(response.data);
        setPaginationInfo(response.meta);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [query, filter]
  );

  useEffect(() => {
    fetchMemberList();
  }, [fetchMemberList]);

  return {
    query,
    filter,
    memberList,
    paginationInfo,
    loading,
    fetchMemberList,
  };
}
