// 업체 생성 페이지 - 유효성 검증 규칙
export const validationRulesOfOrganization = {
  name: {
    isValid: (value: string) => value.trim().length >= 2 && value.length <= 50,
    errorMessage: "업체명은 2~50자 이내로 입력하세요.",
  },
  brNumber: {
    isValid: (value: string) => /^\d{3}-\d{2}-\d{5}$/.test(value),
    errorMessage: "올바른 사업자 등록번호를 입력하세요. (예: 123-45-67890)",
  },
  streetAddress: {
    isValid: (value: string) => value.trim().length > 5,
    errorMessage: "사업장 도로명 주소를 입력하세요.",
  },
  detailAddress: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "사업장 상세 주소를 입력하세요.",
  },
  phoneNumber: {
    isValid: (value: string) => /^\d{3}-\d{4}-\d{4}$/.test(value),
    errorMessage: "올바른 전화번호를 입력하세요.",
  },
  type: {
    isValid: (value: string) => ["CUSTOMER", "DEVELOPER"].includes(value),
    errorMessage: "업체 유형을 선택하세요.",
  },
};

// 로그인 페이지 - 유효성 검증 규칙
export const validationRulesOfLogin = {
  email: {
    isValid: (value: string) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) &&
      !/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(value) && // 한글 입력 방지
      !/\s/.test(value), // 공백 입력 방지
    errorMessage: "올바른 이메일 주소를 입력하세요. (한글 및 공백 불가)",
  },
  password: {
    isValid: (value: string) => /^(?=.*[a-zA-Z\d]).{4,}$/.test(value), // 영문 또는 숫자가 포함된 4자리 이상
    errorMessage:
      "영문/숫자/특수문자가 포함된 비밀번호를 4자리 이상 입력하세요.",
  },
};

// 회원 생성 페이지 - 유효성 검증 규칙
// 입력값에 대한 검증 규칙
export const validationRulesOfCreatingMember = {
  name: {
    isValid: (value: string) => value.trim().length >= 2 && value.length <= 30,
    errorMessage: "회원 성함은 2~30자 이내로 입력하세요.",
  },
  role: {
    isValid: (value: string) => ["MEMBER", "ADMIN"].includes(value),
    errorMessage: "회원 유형을 선택하세요.",
  },
  email: {
    isValid: (value: string) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) &&
      !/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(value) && // 한글 입력 방지
      !/\s/.test(value), // 공백 입력 방지
    errorMessage: "올바른 이메일 주소를 입력하세요. (한글 및 공백 불가)",
  },
  password: {
    isValid: (value: string) =>
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{4,}$/.test(value),
    errorMessage:
      "영문, 숫자, 특수문자를 포함하여 최소 8자리 이상 비밀번호를 입력하시기 바랍니다.",
  },
  phoneNum: {
    isValid: (value: string) => /^\d{3}-\d{4}-\d{4}$/.test(value),
    errorMessage: "올바른 전화번호를 입력하세요. (예: 010-1234-5678)",
  },
  jobRole: {
    isValid: (value: string) => value.trim().length >= 1 && value.length <= 30,
    errorMessage: "직무를 입력하세요.",
  },
  jobTitle: {
    isValid: (value: string) => value.trim().length >= 1 && value.length <= 30,
    errorMessage: "직함을 입력하세요.",
  },
  introduction: {
    isValid: (value: string) => value.length <= 500,
    errorMessage: "회원 소개는 최대 500자까지 입력 가능합니다.",
  },
  remark: {
    isValid: (value: string) => value.length <= 200,
    errorMessage: "특이사항은 최대 200자까지 입력 가능합니다.",
  },
};

// validationRulesOfUpdatingMember의 키를 MemberProps 전체가 아니라 유효성 검사가 필요한 필드만 따로 명시함

const updatableFields = [
  "phoneNum",
  "name",
  "jobRole",
  "jobTitle",
  "introduction",
  "remark",
] as const;

export const validationRulesOfUpdatingMember: Record<
  (typeof updatableFields)[number], // ✅ 특정 필드만 타입으로 지정
  {
    isValid: (value: string) => boolean;
    errorMessage: string;
  }
> = {
  phoneNum: {
    isValid: (value: string) => /^\d{3}-\d{3,4}-\d{4}$/.test(value), // 전화번호 형식 체크
    errorMessage: "유효한 전화번호 형식이 아닙니다. (예: 010-1234-5678)",
  },
  name: {
    isValid: (value: string) => value.trim().length >= 2 && value.length <= 30,
    errorMessage: "이름은 2~30자 이내로 입력해야 합니다.",
  },
  jobRole: {
    isValid: (value: string) => value.trim().length >= 1 && value.length <= 30,
    errorMessage: "직무를 입력해주세요.",
  },
  jobTitle: {
    isValid: (value: string) => value.trim().length >= 1 && value.length <= 30,
    errorMessage: "직함을 입력해주세요.",
  },
  introduction: {
    isValid: (value: string) => value.length <= 500,
    errorMessage: "회원 소개는 최대 500자까지 입력 가능합니다.",
  },
  remark: {
    isValid: (value: string) => value.length <= 200,
    errorMessage: "특이사항은 최대 200자까지 입력 가능합니다.",
  },
};

// 프로젝트 생성, 수정 시 입력 유효성 검증 로직
export const validationRulesOfProject = [
  {
    field: "name",
    condition: (value: string) => value.length < 2,
    message: "프로젝트명을 2글자 이상 입력해주세요.",
  },
  {
    field: "description",
    condition: (value: string) => value.length < 2,
    message: "프로젝트 개요를 2글자 이상 입력해주세요.",
  },
  {
    field: "startAt",
    condition: (value: string) => !value,
    message: "프로젝트 시작일을 선택해주세요.",
  },
  {
    field: "deadlineAt",
    condition: (value: string) => !value,
    message: "프로젝트 예정 마감일을 선택해주세요.",
  },
  {
    field: "customerOrgId",
    condition: (value: string) => !value,
    message: "고객사를 지정해주세요.",
  },
  {
    field: "developerOrgId",
    condition: (value: string) => !value,
    message: "개발사를 지정해주세요.",
  },
  // {
  //   field: "members",
  //   condition: (value: number[]) => value.length === 0,
  //   message: "업체 담당자 회원을 배정해주세요.",
  // },
  // {
  //   field: "selectedDeveloperMembers",
  //   condition: (value: number[]) => value.length === 0,
  //   message: "개발사 담당자 회원을 배정해주세요.",
  // },
  {
    field: "customerOwnerId",
    condition: (value: string) => !value,
    message: "고객사 Owner을 지정해주세요.",
  },
  {
    field: "devOwnerId",
    condition: (value: string) => !value,
    message: "개발사 Owner을 지정해주세요.",
  },
];
