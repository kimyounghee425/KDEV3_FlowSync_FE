// 공통 API 응답 타입 (리스트 응답)
// 기본 타입 (meta 포함 X)
export interface CommonResponseType<T> {
  code: number; // 상태 코드
  result: string; // 요청 결과 (SUCCESS, FAILURE 등)
  message?: string;
  data: T; // 제네릭 데이터
}

// meta를 포함하는 타입
export interface CommonResponseWithMetaType<T> extends CommonResponseType<T> {
  data: T & { meta: PaginationProps }; // data 내부에 meta 포함
}

export interface ReissueResponse {
  access: string;
  refresh: string;
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
  status: "ACTIVE" | "INACTIVE" | "DELETED"; // 상태 (Enum)
  email: string; // 회원 이메일
  name: string; // 회원 이름
  phoneNum: string; // 연락처
  jobRole: string; // 직무
  jobTitle: string; // 직책
  regAt: string; // 등록일
  introduction: string; // 자기소개
  remark: string; // 비고
}

// `createMember` 함수에서 입력값의 타입 정의
export interface CreateMemberInput {
  role: string;
  organizationId: number;
  name: string;
  email: string;
  password: string;
  phoneNum: string;
  jobRole: string;
  jobTitle: string;
  introduction: string;
  remark: string;
}

// 반환값의 타입 정의
export interface CreateMemberResponse {
  success: boolean;
  member: MemberProps;
}

export interface MemberListResponse {
  members: MemberProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

// 🔹 회원 삭제 응답 타입 정의
export interface DeleteMemberResponse {
  code: number; // HTTP 상태 코드
  result: "SUCCESS" | "FAIL"; // 결과 상태
  message: string; // 응답 메시지
}

// 🔹 회원 상태 활성화로 변경 응답 타입 정의
export interface ActivateMemberResponse {
  code: number; // HTTP 상태 코드
  result: "SUCCESS" | "FAIL"; // 결과 상태
  message: string; // 응답 메시지
}

// 🔹 회원 상태 비활성화로 변경 응답 타입 정의
export interface DeactivateMemberResponse {
  code: number; // HTTP 상태 코드
  result: "SUCCESS" | "FAIL"; // 결과 상태
  message: string; // 응답 메시지
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
  brNumber: string;
  name: string;
  regAt?: string;
  brCertificateUrl: string;
  streetAddress: string;
  detailAddress: string;
  phoneNumber: string;
  remark?: string;
}

// `createOrganization` 함수에서 입력값의 타입 정의
export interface CreateOrganizationInput {
  type: string;
  brNumber: string;
  name: string;
  streetAddress: string;
  detailAddress: string;
  phoneNumber: string;
}

// 반환값의 타입 정의
export interface CreateOrganizationResponse {
  success: boolean;
  organization: OrganizationProps;
}

export interface OrganizationListResponse {
  dtoList: OrganizationProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

// 🔹 업체 삭제 응답 타입 정의 (탈퇴 사유 포함 X)
export interface DeleteOriginationResponse {
  code: number; // HTTP 상태 코드
  result: "SUCCESS" | "FAIL"; // 결과 상태
  message: string; // 응답 메시지
}

// 🔹 업체 삭제 응답 타입 정의 (탈퇴 사유 포함 ver.)
export interface DeleteOriginationWithReasonResponse {
  code: number; // HTTP 상태 코드
  result: "SUCCESS" | "FAIL"; // 결과 상태
  message: string; // 응답 메시지
}

export interface CreateProjectInput {
  name: string; // 프로젝트 이름
  description: string;
  detail: string;
  managementStep: string; // 계약단계
  startAt: string;
  deadlineAt: string;
  // closeAt?: string;
  devOwnerId: string;
  customerOwnerId: string;
  developerOrgId: string;
  customerOrgId: string;
  members: string[];
}

// 반환값의 타입 정의
export interface CreateProjectResponse {
  success: boolean;
  member: ProjectProps;
}

export interface ProjectInfoProps {
  id: string; // 프로젝트 아이디
  projectName: string; // 프로젝트명
  description: string; // 프로젝트 설명
  devOrgName: string; // 개발사명
  memberName: string; // 대표 담당자 이름
  profileImageUrl: string; // 프로필 이미지 URL
  jobRole: string; // 직무
  jobTitle: string; // 직급
  phoneNum: string; // 연락처
  startAt: string; // 프로젝트 시작일
  closeAt: string; // 프로젝트 종료일
}

// 프로젝트 속성
export interface ProjectProps {
  id: string; // 프로젝트 ID
  name: string; // 프로젝트 이름
  description: string;
  managementStep: string;
  regAt: string; // 등록일
  updateAt: string; // 수정일
  startAt: string; // 시작일
  deadlineAt: string; // 예정 마감일
  closeAt: string; // 마감일시
  deletedYn: string; // 삭제여부
  devOwnerId: string; // 개발사 대표 담당자 ID
  developerName: string; // 개발사 이름
  customerName: string; // 고객사 이름
  clickable: number; // 클릭 가능 여부
}

// 프로젝트 상세 조회
export interface ProjectDetailProps {
  id: string; // 프로젝트 ID
  name: string; // 프로젝트 이름
  description: string;
  detail: string;
  managementStep: string; // 계약단계
  startAt: string;
  deadlineAt: string;
  closeAt?: string;
  devOwnerId: string;
  customerOwnerId: string;
  developerOrgId: string;
  customerOrgId: string;
  members: string[];
}

export interface ProjectListResponse {
  projects: ProjectProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

// 업체 별 참여 중 프로젝트 목록 조회 API 응답 결과
export interface OrganizationProjectListResponse {
  dtoList: ProjectProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

// 회원 별 참여 중 프로젝트 목록 조회 API 응답 결과
export interface MemberProjectListResponse {
  dtoList: ProjectProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

export interface ProjectSidebarProps {
  id: string;
  name: string;
  clickable: string;
}
export interface ProjectListSidebarResponse {
  projects: ProjectSidebarProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

// 프로젝트 기본 정보
export interface ProjectInfoProps {
  id: string;
  projectName: string; // 프로젝트명
  description: string; // 설명
  managementStep: string; // 관리단계
  developerOrgName: string; // 개발사명
  developerOwnerName: string; // 개발사 대표 담당자 이름
  developerProfileImageUrl: string; // 개발사 대표 담당자 이미지 URL
  developerJobRole: string; // 개발사 직무
  developerJobTitle: string; // 개발사 직급
  developerPhoneNum: string; // 개발사 대표담당자 번호
  customerOrgName: string; // 고객사 이름
  customerOwnerName: string; // 고객사 대표담당자 이름
  customerProfileImageUrl: string; //고객사 이미지 URL
  customerJobRole: string; // 고객사 직무
  customerJobTitle: string; // 고객사
  customerPhoneNum: string; // 고객사 대표담당자 번호
  startAt: string; // 시작일
  deadlineAt: string; // 마감일
  closeAt: string; // 종료일
}

export interface ProgressStep {
  id: string;
  name: string;
  description: string;
  stepOrder: string;
  status: string;
  startAt: string;
  closeAt: string;
  deadlineAt: string;
  projectId: string;
  relatedApprovalId: string;
  approver: Approver;
}

export interface Register {
  id: string;
  role: string;
  name: string;
  organizationId: string;
  organizationName: string;
  organizationType: string;
}

export interface Approver {
  id: string;
  role: string;
  name: string;
  organizationId: string;
  organizationName: string;
  organizationType: string;
}

// 결재글 목록 속성
export interface ProjectApprovalProps {
  id: string;
  projectId: string;
  progressStep: ProgressStep;
  title: string;
  status: string; // 결제 상태 WAIT, APPROVED, REJECTED
  category: string; // 결제 유형 COMPLETE_REQUEST, NORMAL_REQUEST
  register: Register;
  regAt: string;
  updatedAt: string;
  approvedAt: string;
  approver: Approver;
  deleted: boolean;
}

export interface ProjectApprovalListResponse {
  projectApprovals: ProjectApprovalProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

// 질문글 목록 속성
export interface ProjectQuestionProps {
  id: string;
  title: string;
  progressStep: ProgressStep;
  category: string; // QUESTION, ANSWER
  status: string; // WAIT, COMPLETED
  createdDate: string;
  register: Register;
  projectId: string;
}

export interface ProjectQuestionListResponse {
  projectQuestions: ProjectQuestionProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

export interface QuestionApiResponse {
  code: number;
  result: string;
  message: string;
  data: QuestionArticle;
}

export interface ApprovalApiResponse {
  code: number;
  result: string;
  message: string;
  data: ApprovalArticle;
}

export interface NoticeApiResponse {
  code: number;
  result: string;
  message: string;
  data: NoticeArticle;
}

export interface CommentApiResponse {
  code: number;
  result: string;
  message: string;
  data: ArticleComment;
}

export interface SignApiResponse {
  code: number;
  result: string;
  message: string;
  data: SignData;
}

export interface SignData {
  hasSignatures: boolean;
  signatureUrl: string;
}

// 게시글의 콘텐츠 블럭
export interface ContentBlock {
  type: string;
  data: string | { src: string };
}

// 게시글

export interface Article {
  id: number;
  number: number;
  title: string;
  content: ContentBlock[];
  regAt: string;
  editAt: string;
  approverAt: string;
  category: string;
  status: string;
  deletedYn: string;
  author: string;
  fileList: ArticleFile[];
  linkList: ArticleLink[];
  commentList: ArticleComment[];
}

export interface QuestionArticle {
  id: number;
  number: number;
  title: string;
  content: ContentBlock[];
  regAt: string;
  editAt: string;
  approverAt: string;
  category: string;
  status: string;
  deletedYn: string;
  register: {
    id: number;
    name: string;
    role: string;
    organizationId: number;
  };

  fileList: ArticleFile[];
  linkList: ArticleLink[];
  commentList: ArticleComment[];
}

export interface ApprovalArticle {
  id: number;
  number: number;
  title: string;
  content: ContentBlock[];
  regAt: string;
  editAt: string;
  approverAt: string;
  category: string;
  status: string;
  deletedYn: string;
  author: string;
  register: {
    id: number;
    role: string;
    name: string;
    organizationId: number;
    organizationName: string;
    organizationType: string;
    signatureUrl: string;
  };
  approver: {
    role: string;
    name: string;
    organizationId: number;
    organizationName: string;
    organizationType: string;
    signatureUrl: string;
  };
  fileList: ArticleFile[];
  linkList: ArticleLink[];
  commentList: ArticleComment[];
}

export interface NoticeArticle {
  id: string;
  title: string;
  content: ContentBlock[];
  category: string;
  priority: string;
  isDeleted: string;
  regAt: string;
  updatedAt: string;
  fileInfoList: ArticleFile[];
}

// 게시글 첨부링크
export interface ArticleLink {
  id: number;
  name: string;
  url: string;
}

// 게시글 첨부파일
export interface ArticleFile {
  originalName: string;
  saveName: string;
  url: string;
  size: number;
}

// 댓글
export interface ArticleComment {
  id: number;
  register: {
    id: number;
    name: string;
    role: string;
  };
  deleted: boolean;
  content: string;
  regAt: string;
  editAt: string;
  parentId: number;
  isParent: boolean;
}

// 회원/업체 생성 페이지 입력 폼 인터페이스
export interface InputFormData {
  label: string;
  id: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "file"
    | "address"; // 가능한 타입만 명시;
  placeholder?: string;
  value?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  isChanged?: boolean;
  maxLength?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
}

// 공지사항
export interface NoticeProps {
  id: string; // 공지사항 ID
  adminId: string; // 프로젝트 이름
  title: string; // 계약 단계
  content: string; // 시작일시
  category: string; // 시작일시
  priority: string; //
  isDeleted: string; // 마감일시
  regAt: string; // 고객사 이름
  updatedAt: string; // 개발사 이름
}

export interface NoticeListResponse {
  notices: NoticeProps[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

export interface ProjectProgressStepProps {
  id: string;
  title: string;
  value?: string;
  count?: number;
  status?: string;
}
export interface UserInfoResponse {
  id: string;
  role: string;
  name: string;
  organizationId: string;
  organizationName: string;
  organizationType: string;
  projectIdList: number[];
}

export interface BaseArticleRequestData {
  title: string;
  progressStepId?: number;
  content: { type: string; data: string | { src: string } }[];
  linkList: { name: string; url: string }[];
  fileInfoList: {
    originalName: string;
    saveName: string;
    url: string;
    size: number;
  }[];
}

export interface QuestionRequestData extends BaseArticleRequestData {
  progressStepId?: number;
}

export interface ApprovalRequestData extends BaseArticleRequestData {
  progressStepId?: number;
}

export interface NoticeRequestData extends BaseArticleRequestData {
  category?: string;
  priority?: string;
}

export interface ManagementStepCountMap {
  IN_PROGRESS: number;
  MAINTENANCE: number;
  PAUSED: number;
  COMPLETED: number;
  CONTRACT: number;
}

// 진행단계 로그
export interface CompletionHistory {
  id: string;
  projectId: string;
  approvalId: string;
  approvalName: string;
  actor: Actor;
  progressStep: ProgressStep;
  regAt: string;
  status: string;
}

export interface CompletionHistoryListResponse {
  completionHistories: CompletionHistory[];
  meta: PaginationProps; // 페이지네이션 메타 정보
}

export interface Actor {
  id: string;
  role: string;
  name: string;
  organizationId: string;
  organizationName: string;
  organizationType: string;
}

export interface ProgressStepOrder {
  id: string;
  order: number;
  title?: string;
}
