export interface ProjectProps {
  id: number;              // 프로젝트 ID
  projectName: string;     // 프로젝트 이름
  client: string;          // 고객사 이름
  developer: string;       // 개발사 이름
  projectStatus: string;   // 계약 단계
  startAt: string;       // 시작일
  closeAt: string;         // 종료일
}