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
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import styles from "@/src/components/layouts/InputFormLayout.module.css";

export default function InputFormLayout({
  title,
  children,
  onSubmit,
  isLoading,
  onDelete, // 삭제 핸들러 추가
  deleteEntityType, // 삭제할 대상 (회원, 업체, 프로젝트 등)
  isDisabled, // 수정 버튼 비활성화 여부
}: {
  title: string; // 페이지 제목
  children: ReactNode; // 폼 내부 요소
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // 폼 제출 핸들러
  isLoading: boolean; // 제출 버튼 로딩 상태
  onDelete?: (reason: string) => void; // 삭제 핸들러 (탈퇴 사유 전달)
  deleteEntityType?: "회원" | "업체" | "프로젝트"; // 삭제 대상 지정
  isDisabled?: boolean;
}) {
  const [deleteReason, setDeleteReason] = useState<string>(""); // 삭제 사유 입력 상태
  const urlPathName = usePathname();
  const urlPathSegments = urlPathName.split("/");
  const urlLastPathSegment = urlPathSegments[urlPathSegments.length - 1]; // 생성 페이지와 상세조회 페이지 구분에 쓰일 변수
  const isCreatePage = urlLastPathSegment === "create" ? true : false; // 생성 페이지인지 확인
  const isDetailPage =
    (urlPathName.includes(`/admin/members/`) ||
      urlPathName.includes(`/admin/organizations/`) ||
      urlPathName.includes("/edit")) &&
    !isCreatePage; // create가 아닌 경우만 상세 페이지로 처리

  const entityType = deleteEntityType || "항목"; // deleteEntityType이 undefined일 경우 삭제 버튼이 생성되지 않아서 기본값을 설정

  return (
    <Flex direction="column" width="80vh" justifyContent="center" gap="1rem">
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <form onSubmit={onSubmit}>
            {/* 📌 페이지 타이틀 */}
            <Flex
              className={styles.pageTitle}
              justifyContent="space-between"
              alignItems="center"
            >
              <h1>{title}</h1>
              <Box className={styles.buttonContainer}>
                {isDetailPage ? (
                  <Flex gap="1rem">
                    {/* 수정 버튼 */}
                    <button
                      type="submit"
                      className={`${styles.submitButton} ${
                        isLoading ? styles.loading : ""
                      }`}
                      disabled={isLoading || isDisabled}
                      aria-busy={isLoading}
                    >
                      {isLoading ? "처리 중..." : `${entityType} 수정`}
                    </button>
                    {/* 삭제 버튼 - 차크라 UI Dialog 컴포넌트 이용 */}
                    {onDelete && ( // 삭제 핸들러가 존재하는 경우만 표시
                      <DialogRoot role="alertdialog">
                        <DialogTrigger asChild>
                          <button className={styles.deleteButton}>
                            {entityType} 삭제
                          </button>
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
                  </Flex>
                ) : (
                  /* 신규 등록 버튼 */
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
              </Box>
            </Flex>
            {/* 📌 페이지 버튼 - 등록/수정/삭제 */}
            {/* 📌 페이지 입력폼 */}
            {children}
          </form>
        </div>
      </div>
    </Flex>
  );
}
