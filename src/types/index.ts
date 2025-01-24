// 공통 API 응답 타입 (리스트 응답)
export interface CommonResponseType<T> {
  code: number; // 상태 코드
  result: string; // 요청 결과 (SUCCESS, FAILURE 등)
  data: T; // 제네릭 데이터
}

// 서버에서 반환되는 페이징 메타데이터 타입
export interface PaginationProps {
  currentPage: number; // 현재 페이지 번호
  totalPages: number; // 전체 페이지 수
  pageSize: number; // 한 페이지당 데이터 개수
  totalElements: number; // 전체 데이터 수
  isFirstPage: boolean; // 첫 번째 페이지 여부
  isLastPage: boolean; // 마지막 페이지 여부
}

// 회원 타입
export interface MemberProps {
  id: string; // 회원 ID
  organizationId: string; // 소속 업체 ID
  organizationName: string; // 소속 업체 이름
  role: "ADMIN" | "MEMBER"; // 역할 (Enum)
  status: "ACTIVE" | "INACTIVE"; // 상태 (Enum)
  email: string; // 회원 이메일
  name: string; // 회원 이름
  phoneNum: string; // 연락처
  jobRole: string; // 직무
  jobTitle: string; // 직책
  regAt: string; // 등록일
  introduction: string; // 자기소개
  remark: string; // 비고
}

export interface MemberListResponse {
  members: MemberProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

export interface LoginFormData {
  label: string;
  id: string;
  type: "text" | "email" | "password" | "number" | "tel" | "url"; // 가능한 타입만 명시
  placeholder: string;
}

export interface OrganizationProps {
  id: string;
  type: string;
  status: string;
  brNumber: string | null;
  name: string;
  reg_at: string;
  brCertificateUrl: string | null;
  streetAddress: string | null;
  detailAddress: string | null;
  phone_number: string | null;
  remark: string | null;
}

export interface OrganizationListResponse {
  organizations: OrganizationProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

// 프로젝트 속성
export interface ProjectProps {
  id: string; // 프로젝트 ID
  name: string; // 프로젝트 이름
  status: string; // 계약 단계
  startAt: string; // 시작일시
  closeAt: string; // 마감일시
  customerName: string; // 고객사 이름
  developerName: string; // 개발사 이름
}
export interface ProjectListResponse {
  projects: ProjectProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

// 프로젝트 기본 정보
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

// 결재글 속성
export interface ProjectTaskProps {
  id: number;
  number: number;
  title: string;
  content: string;
  regAt: string;
  editAt: string;
  approveAt: string;
  category: string; // 진행단계
  status: string; // 게시글 유형
  deletedYn: string;
  currentPage: number; // 현재 페이지
  pageSize: number; // 페이지 크기
}

export interface ProjectTaskListResponse {
  projectTasks: ProjectTaskProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

// 질문글 속성
export interface ProjectQuestionProps {
  id: string;
  number: number;
  title: string;
  content: string;
  regAt: string;
  editAt: string;
  approveAt: string;
  category: string; // 진행단계
  status: string; // 게시글 유형
  deletedYn: string;
  currentPage: number; // 현재 페이지
  pageSize: number; // 페이지 크기
}

export interface ProjectQuestionListResponse {
  projectQuestions: ProjectQuestionProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

export interface ApiResponse {
  code: number;
  result: string;
  message: string;
  data: Task;
}
// 게시글의 콘텐츠 블럭
export interface ContentBlock {
  type: "paragraph" | "image";
  data: string | { src: string };
}

export interface TaskBoardLink {
  id: number;
  name: string;
  url: string;
}

// 게시글
export interface Task {
  id: number;
  projectid: number;
  number: number;
  parent?: {
    title: string;
  } | null;
  progress: string;
  title: string;
  author: string;
  boardCategory: string; // 아직 미사용
  boardStatus: string; // 아직 미사용
  regAt: string;
  editAt: string;
  content: ContentBlock[]; // ContentBlock 인터페이스 사용
  file: string[]; // 첨부파일
  taskBoardLinkList: TaskBoardLink[];
  commentList: Comment[];
}

export interface TaskCommentsProps {
  comments: Comment[];
}

// 댓글
export interface Comment {
  id: number;
  author: string;
  content: string;
  regAt: string;
  editAt: string;
  deletedYn: string;
  parentId: number | null;
  replies: Reply[];
}

// 댓글의 답글
export interface Reply {
  id: number;
  author: string;
  content: string;
  regAt: string;
  editAt: string;
  parentId: number;
  deletedYn: "Y" | "N";
}

// 회원/업체 생성 페이지 입력 폼 인터페이스
export interface InputFormData {
  label: string;
  id: string;
  type: "text" | "email" | "password" | "number" | "tel" | "url"; // 가능한 타입만 명시
  placeholder: string;
  value?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
