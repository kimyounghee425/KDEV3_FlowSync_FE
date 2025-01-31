"use client";

import { ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation"; // 현재 URL 경로 가져오기
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
} from "@/src/components/ui/dialog"; // Chakra UI Dialog
import { Button, Input, Text } from "@chakra-ui/react";
import styles from "@/src/components/layouts/InputFormLayout.module.css";

export default function InputFormLayout({
  title,
  children,
  onSubmit,
  isLoading,
  onDelete, // 삭제 핸들러 추가
  deleteEntityType, // 삭제할 대상 (회원, 업체, 프로젝트 등)
}: {
  title: string; // 페이지 제목
  children: ReactNode; // 폼 내부 요소
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // 폼 제출 핸들러
  isLoading: boolean; // 제출 버튼 로딩 상태
  onDelete?: (reason: string) => void; // 삭제 핸들러 (탈퇴 사유 전달)
  deleteEntityType?: "회원" | "업체" | "프로젝트"; // 삭제 대상 지정
}) {
  const pathname = usePathname();
  const isDetailPage =
    pathname.includes(`/admin/members/`) ||
    pathname.includes(`/admin/organizations/`);
  const [deleteReason, setDeleteReason] = useState<string>(""); // 삭제 사유 입력 상태
  const entityType = deleteEntityType || "항목"; // deleteEntityType이 undefined일 경우 삭제 버튼이 생성되지 않아서 기본값을 설정

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* 페이지 타이틀 */}
        <h1 className={styles.pageTitle}>{title}</h1>
        <form onSubmit={onSubmit}>
          {children}
          <div className={styles.buttonContainer}>
            {isDetailPage ? (
              <>
                {/* 📌 수정 버튼 */}
                <button
                  type="submit"
                  className={`${styles.submitButton} ${
                    isLoading ? styles.loading : ""
                  }`}
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? "처리 중..." : "수정하기"}
                </button>
                {/* 📌 삭제 버튼 - 차크라 UI Dialog 컴포넌트 이용 */}
                {onDelete && ( // 삭제 핸들러가 존재하는 경우만 표시
                  <DialogRoot role="alertdialog">
                    <DialogTrigger asChild>
                      <Button className={styles.deleteButton}>
                        {entityType} 삭제
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{entityType} 삭제</DialogTitle>
                      </DialogHeader>
                      <DialogBody>
                        <Text fontWeight="medium" mb="2">
                          {entityType} 삭제 사유를 입력하세요.
                        </Text>
                        <Input
                          placeholder={`${entityType} 삭제 사유 입력`}
                          size="sm"
                          value={deleteReason}
                          onChange={(e) => setDeleteReason(e.target.value)} // 입력값 업데이트
                        />
                      </DialogBody>
                      <DialogFooter>
                        <DialogActionTrigger asChild>
                          <Button variant="outline">취소</Button>
                        </DialogActionTrigger>
                        <Button
                          colorScheme="red"
                          disabled={!deleteReason.trim()} // 삭제 사유 입력 전까지 비활성화
                          opacity={deleteReason.trim() ? 1 : 0.5} // 비활성화 시 흐린 색상 적용
                          onClick={() => {
                            onDelete(deleteReason);
                            setDeleteReason(""); // 입력값 초기화
                          }}
                        >
                          삭제 확인
                        </Button>
                      </DialogFooter>
                      <DialogCloseTrigger />
                    </DialogContent>
                  </DialogRoot>
                )}
              </>
            ) : (
              /* ✅ 신규 등록 버튼 */
              <button
                type="submit"
                className={`${styles.submitButton} ${
                  isLoading ? styles.loading : ""
                }`}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? "처리 중..." : "등록하기"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
