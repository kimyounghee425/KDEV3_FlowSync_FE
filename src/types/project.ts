export interface ProjectProps {
  id: number;              // 프로젝트 ID
  projectName: string;     // 프로젝트 이름
  client: string;          // 고객사 이름
  developer: string;       // 개발사 이름
  contractStage: string;   // 계약 단계
  progressStage: string;   // 진행 단계
  startDate: string;       // 시작일
  endDate: string;         // 종료일
}