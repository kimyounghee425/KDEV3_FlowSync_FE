"use client";

import { useState } from "react";
import styles from "@/src/components/common/ActionButtons.module.css";
import ConfirmDialogEditDelete from "./ConfirmDialogEditDelete";

interface ButtonEditDeleteProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  onSubmit?: () => void;
  onDelete?: (reason: string) => void;
  deleteEntityType?: string; // 삭제 대상 (회원, 업체, 프로젝트 등)
}

export default function ButtonEditDelete({
  onSubmit,
  onDelete,
  deleteEntityType = "항목",
}: ButtonEditDeleteProps) {
  const [deleteReason, setDeleteReason] = useState("");

  return (
    <div className={styles.buttonContainer}>
      {/* 수정 버튼 */}
      <ConfirmDialogEditDelete
        onConfirm={onSubmit || (() => {})}
        title="항목 수정"
        description="이 항목을 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        triggerText="수정"
      />

      {/* 삭제 버튼 */}
      {onDelete && (
        <ConfirmDialogEditDelete
          onConfirm={() => {
            onDelete(deleteReason);
            setDeleteReason("");
          }}
          title={`${deleteEntityType} 삭제`}
          description={`${deleteEntityType} 삭제 사유를 입력하세요.`}
          confirmText="삭제 확인"
          cancelText="취소"
          triggerText={`${deleteEntityType} 삭제`}
        />
      )}
    </div>
  );
}
