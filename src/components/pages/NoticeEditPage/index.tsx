"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";
import BackButton from "@/src/components/common/BackButton";
import { NoticeArticle, NoticeRequestData } from "@/src/types";
import SelectInput from "@/src/components/common/FormSelectInput";
import { useEditNotice } from "@/src/hook/useMutationData";
import ErrorAlert from "@/src/components/common/ErrorAlert";
import "@/src/styles/edit.css";
import { Loading } from "@/src/components/common/Loading";
import ConfirmDialog from "@/src/components/common/ConfirmDialog";
import { useReadNotice } from "@/src/hook/useFetchData";

const categoryData = [
  { id: 1, title: "서비스업데이트", value: "SERVICE_UPDATE" },
  { id: 2, title: "정책변경", value: "POLICY_CHANGE" },
  { id: 3, title: "점검안내", value: "MAINTENANCE" },
  { id: 4, title: "기타", value: "OTHER" },
];

const priorityData = [
  { id: 1, title: "긴급", value: "EMERGENCY" },
  { id: 2, title: "일반", value: "NORMAL" },
];

const ArticleForm = dynamic(
  () => import("@/src/components/common/ArticleForm"),
  {
    ssr: false,
  },
);

export default function NoticeEditPage() {
  const noticeId = String(useParams().noticeId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams?.get("currentPage") || "1";

  const { mutate: editNotice } = useEditNotice();
  const {
    data: noticeData,
    loading: noticeLoading,
    error: noticeError,
  } = useReadNotice(noticeId);

  const [notice, setNotice] = useState<NoticeArticle | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (noticeData) {
      setNotice(noticeData);
    }
  }, [noticeData]);

  // 수정 API
  const handleSave = async (requestData: NoticeRequestData) => {
    if (!notice) return;
    try {
      await editNotice(noticeId, {
        ...requestData,
        category: notice.category || requestData.category,
        priority: notice.priority || requestData.priority,
      });
      // 수정 성공 후 이동 여부를 묻는 모달 열기
      setIsConfirmDialogOpen(true);
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  // 이동 확인 모달에서 "확인" 클릭 시 라우팅 실행
  const handleConfirmNavigation = () => {
    setIsConfirmDialogOpen(false);
    router.push(`/notices?currentPage=${currentPage}`);
  };

  if (noticeLoading) return <Loading />;

  return (
    <Box
      maxW="1000px"
      w={"100%"}
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <BackButton />

      {noticeError && (
        <ErrorAlert message="공지사항 조회에 실패했습니다. 다시 시도해주세요." />
      )}
      {notice && (
        <ArticleForm
          progressStepId={1} // 임시
          initialTitle={notice.title || ""}
          initialContent={notice.content || []}
          initialUploadedFiles={notice.fileList || []}
          title={notice.title || ""}
          setTitle={(value) =>
            setNotice((prev) => (prev ? { ...prev, title: value } : null))
          }
          handleSave={handleSave}
          submitButtonLabel="수정"
        >
          <SelectInput
            label="우선순위"
            selectedValue={notice.priority}
            setSelectedValue={(value) =>
              setNotice((prev) => (prev ? { ...prev, priority: value } : null))
            }
            options={priorityData}
          />
          <SelectInput
            label="카테고리"
            selectedValue={notice.category}
            setSelectedValue={(value) =>
              setNotice((prev) => (prev ? { ...prev, category: value } : null))
            }
            options={categoryData}
          />
        </ArticleForm>
      )}

      {/* ✅ 수정 성공 후 이동 여부 확인 모달 */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmNavigation}
        title="공지사항 수정 완료"
        description="공지사항이 성공적으로 수정되었습니다. 목록으로 이동하시겠습니까?"
        confirmText="이동"
        cancelText="취소"
      />
    </Box>
  );
}
