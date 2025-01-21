export interface ProjectProps {
  id: number; // 프로젝트 ID
  name: string; // 프로젝트 이름
  status: string; // 계약 단계
  startAt: string; // 시작일시
  closeAt: string; // 마감일시
  customerName: string; // 고객사 이름
  developerName: string; // 개발사 이름
}

export interface ProjectInfoProps {
  projectTitle: string; // 프로젝트명
  jobRole: string; // 직무
  profileImageUrl: string; // 프로필 이미지 URL
  name: string; // 담당자 이름
  jobTitle: string; // 직급
  phoneNum: string; // 담당자 연락처
  projectStartAt: string; // 프로젝트 시작일
  projectCloseAt: string; // 프로젝트 종료일
}

export interface ProjectPostProps {
  id: number, 
  number:number, 
  title: string,
  content: string,
  regAt: string,
  editAt: string,
  approveAt: string,
  boardCategory:string, // 진행단계
  boardStatus:string, // 게시글 유형
  deletedYn: string,
  currentPage: number, // 현재 페이지
  pageSize: number, // 페이지 크기
}