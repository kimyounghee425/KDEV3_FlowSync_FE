import { useCallback, useEffect, useState } from "react";
import { fetchNoticeList as fetchNoticeListApi } from "@/src/api/notices";
import { CommonResponseType, NoticeProps } from "@/src/types";

export function useNoticeList() {
  const [noticeList, setNoticeList] = useState<NoticeProps[]>([]);

  const [loading, setLoading] = useState(false);

  /**
   * 서버에서 프로젝트 목록을 가져오는 함수
   * @param currentPage 현재 페이지 (기본값: 1)
   * @param pageSize 페이지 크기 (기본값: 5)
   */
  const fetchNoticeList = useCallback(async () => {
    setLoading(true);
    try {
      const response: CommonResponseType<NoticeProps[]> =
        await fetchNoticeListApi();

      setNoticeList(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 컴포넌트 마운트 시 (또는 쿼리 파라미터가 변경될 때) 프로젝트 목록을 가져옴
   */
  useEffect(() => {
    fetchNoticeList();
  }, []);

  return {
    noticeList,
    loading,
  };
}
