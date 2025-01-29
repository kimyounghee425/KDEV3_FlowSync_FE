"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation"; // ✅ 현재 URL 경로 가져오기
import styles from "./InputFormLayout.module.css";

export default function InputFormLayout({
  title,
  children,
  onSubmit,
  isLoading,
  onDelete, // 삭제 핸들러 추가
}: {
  title: string; // title - 페이지 별 입력 폼 타이틀
  children: ReactNode; // 입력 폼 내부에 렌더링 될 내용
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // 입력 폼 제출 핸들러
  isLoading: boolean; // 제출 버튼의 로딩 상태
  onDelete?: () => void; // 삭제 핸들러 (선택 사항)
}) {
  const pathname = usePathname();
  const isDetailPage = pathname.includes(`/admin/members/`); // ✅ 상세 조회 페이지 여부 확인

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <form onSubmit={onSubmit}>
          {children}
          <div className={styles.buttonContainer}>
            {isDetailPage ? (
              <>
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
                {onDelete && (
                  <button
                    type="button"
                    className={styles.deleteButton} // ✅ 삭제 버튼 스타일 적용
                    onClick={onDelete}
                  >
                    삭제하기
                  </button>
                )}
              </>
            ) : (
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
