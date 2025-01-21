import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MemberProps } from "../types/member";
import { fetchMembers } from "../api/members";
import { MemberResponseType } from "../types/api";

export function useMemberList() {
  const [memberList, setMemberList] = useState<MemberProps[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || "";

  const fetchMemberList = useCallback(
    async (currentPage: number = 1, pageSize: number = 5) => {
      setLoading(true);
      try {
        const response: MemberResponseType<{ members: MemberProps[] }> = await fetchMembers(query, filter, currentPage - 1, pageSize);
        setMemberList(response.data.members);
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
    console.log("시작할 때 딱 1번만 실행");
  }, [fetchMemberList]);

  console.log("memberList: ", memberList);
  return {
    query,
    filter,
    memberList,
    loading,
    fetchMemberList,
  };
}
