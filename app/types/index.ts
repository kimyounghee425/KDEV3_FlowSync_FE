export interface ProjectsProps {
  id: number;
  projectName: string;
  client: string;
  developer: string;
  contractStage: string;
  progressStage: string;
  startDate: string;
  endDate: string;
}

export interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}