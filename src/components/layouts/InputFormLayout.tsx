import { ReactNode } from "react";
import styles from "./InputFormLayout.module.css";

export default function InputFormLayout({
  title,
  children,
  onSubmit,
  isLoading,
}: {
  title: string; // title - 페이지 별 입력 폼 타이틀
  children: ReactNode; // 입력 폼 내부에 렌더링 될 내용
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // 입력 폼 제출 핸들러
  isLoading: boolean; // 제출 버튼의 로딩 상태
}) {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{title}</h1>
        <form onSubmit={onSubmit}>
          {/* {children} 로 각 페이지 컴포넌트가 들어옴 */}
          {children}
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
        </form>
      </div>
    </div>
  );
}
