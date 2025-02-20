export const layoutStyles = {
  // 배경을 덮는 Overlay 스타일 (자연스러운 페이드 인/아웃 추가)
  backgroundLayer: (showOverlay: boolean) => ({
    position: "fixed",
    top: "var(--header-height)",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // 투명도 조절
    transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
    opacity: showOverlay ? 1 : 0,
    visibility: showOverlay ? "visible" : "hidden",
    zIndex: 100, // 사이드바보다 낮고, 콘텐츠 위로
  }),

  // 헤더 스타일
  header: {
    height: "var(--header-height)",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    zIndex: 100, //  헤더가 사이드바보다 높은 우선순위
    backgroundColor: "white",
    boxShadow: "sm",
    paddingX: "1.5rem",
  },

  // 메인 콘텐츠 스타일
  mainContent: (isSidebarOpen: boolean, isListPage: boolean) => ({
    flex: 1,
    transition: "all 0.3s ease-in-out",
    padding: isListPage ? "2rem" : "1rem",
    marginTop: "var(--header-height)", // 헤더 높이만큼 패딩 추가
    // 중앙 정렬을 위해 `marginX: auto`와 `maxWidth` 적용
    marginX: "auto",
    maxWidth: "1400px", // 최대 너비 제한 (적절한 값으로 조절)
    width: "100%", // 부모 요소의 너비를 따라감
    height: "calc(100vh - var(--header-height))", // 사이드바 높이와 동일하게 조정
    backgroundColor: "transparent", // 기존 색상 제거 (배경과 통합)
    position: "relative",
    zIndex: 99, // 컨텐츠가 배경보다 위에 배치됨
  }),

  // 사이드바 스타일
  sidebar: (isSidebarOpen: boolean, isSidebarOverlayPage: boolean) => ({
    position: isSidebarOverlayPage ? "absolute" : "relative", // 프로젝트 페이지면 `absolute`, 홈 대시보드는 `relative`
    top: "var(--header-height)", // 헤더 높이만큼 패딩 추가
    left: "0",
    width: isSidebarOpen ? "250px" : "0px",
    minWidth: "0px",
    height: "calc(100vh - var(--header-height))", // 고정된 높이 설정
    transition: "width 0.2s ease-in-out",
    overflowX: "hidden", // 내부 요소가 남지 않도록 설정
    overflowY: "auto", // 독립적인 스크롤 적용
    backgroundColor: "white",
    borderRight: isSidebarOpen ? "1px solid #ddd" : "none",
    zIndex: isSidebarOverlayPage ? 100 : 99, // 프로젝트 페이지는 다른 콘텐츠 위에 배치
    boxShadow: isSidebarOpen ? "2px 0 5px rgba(0, 0, 0, 0.2)" : "none",
    padding: isSidebarOpen ? "0.1rem 0 0.1rem 0.3rem" : "0", //  사이드바가 닫힐 때 내부 패딩도 제거
  }),
};
