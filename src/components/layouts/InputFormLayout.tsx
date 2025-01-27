import { ReactNode } from "react";

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
    <div
      style={{
        maxWidth: "800px",
        width: "100%",
        margin: "auto",
        padding: "16px",
        borderWidth: "3px",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          padding: "16px",
          backgroundColor: "white",
        }}
      >
        <h1
          style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}
        >
          {title}
        </h1>
        <form onSubmit={onSubmit}>
          {/* {children} 로 각 페이지 컴포넌트가 들어옴 */}
          {children}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: isLoading ? "#ccc" : "#00a8ff", // 기본 배경색
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              transition: "background-color 0.3s ease", // 부드러운 색상 전환
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = "#007acc"; // hover 배경색
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = "#00a8ff"; // 기본 배경색 복구
            }}
          >
            {isLoading ? "처리 중..." : "등록하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
