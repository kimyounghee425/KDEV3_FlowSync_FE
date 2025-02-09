"use client";

import { useState } from "react";
import { Button, Input, Text } from "@chakra-ui/react";
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogCloseTrigger,
} from "@/src/components/ui/dialog";
import styles from "@/src/components/common/ActionButtons.module.css";

interface ButtonEditDeleteProps {
  isLoading: boolean;
  isDisabled?: boolean;
  onSubmit: () => void;
  onDelete?: (reason: string) => void;
  deleteEntityType?: string; // 삭제 대상 (회원, 업체, 프로젝트 등)
}

export default function ButtonEditDelete({
  isLoading,
  isDisabled,
  onSubmit,
  onDelete,
  deleteEntityType = "항목",
}: ButtonEditDeleteProps) {
  const [deleteReason, setDeleteReason] = useState("");

  return (
    <div className={styles.buttonContainer}>
      {/* 수정 버튼 */}
      <button
        type="button"
        className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
        onClick={onSubmit}
        disabled={isLoading || isDisabled}
        aria-busy={isLoading}
      >
        {isLoading ? "처리 중..." : "수정하기"}
      </button>

      {/* 삭제 버튼 */}
      {onDelete && (
        <DialogRoot role="alertdialog">
          <DialogTrigger asChild>
            <Button className={styles.deleteButton}>
              {deleteEntityType} 삭제
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{deleteEntityType} 삭제</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text fontWeight="medium" mb="2">
                {deleteEntityType} 삭제 사유를 입력하세요.
              </Text>
              <Input
                placeholder={`${deleteEntityType} 삭제 사유 입력`}
                size="sm"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
              />
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">취소</Button>
              </DialogActionTrigger>
              <Button
                colorScheme="red"
                disabled={!deleteReason.trim()}
                opacity={deleteReason.trim() ? 1 : 0.5}
                onClick={() => {
                  onDelete(deleteReason);
                  setDeleteReason("");
                }}
              >
                삭제 확인
              </Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>
      )}
    </div>
  );
}
