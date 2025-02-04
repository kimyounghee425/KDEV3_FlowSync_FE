// 업체 생성 페이지 - 유효성 검증 규칙
export const validationRulesOfCreatingOrganization = {
  name: {
    isValid: (value: string) => value.trim() !== "", // trim(): value에서 공백이 모두 제거된 값을 반환
    errorMessage: "업체명을 입력하세요.",
  },
  brNumber: {
    isValid: (value: string) => /^\d{3}-\d{2}-\d{5}$/.test(value),
    errorMessage: "올바른 사업자 등록번호를 입력하세요.",
  },
  streetAddress: {
    isValid: (value: string) => value.trim() !== "",
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
    isValid: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: "올바른 이메일 주소를 입력하세요.",
  },
  // password: {
  //   isValid: (value: string) =>
  //     /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/.test(value),
  //   errorMessage:
  //     "영문, 숫자, 특수문자를 포함하여 최소 8자리 이상 비밀번호를 입력하시기 바랍니다.",
  // },
};

// 회원 생성 페이지 - 유효성 검증 규칙
// 입력값에 대한 검증 규칙
export const validationRulesOfCreatingMember = {
  // organizationId: {
  //   isValid: (value: number) => typeof value !== "number" && !isNaN(value), // trim(): value에서 공백이 모두 제거된 값을 반환
  //   errorMessage: "업체ID를 입력하세요.",
  // },
  // organizationId: {
  //   isValid: (value: string) => typeof value !== "number", // trim(): value에서 공백이 모두 제거된 값을 반환
  //   errorMessage: "업체ID를 입력하세요.",
  // },
  name: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "회원 성함을 입력하세요.",
  },
  role: {
    isValid: (value: string) => ["MEMBER", "ADMIN"].includes(value),
    errorMessage: "회원 유형을 선택하세요.",
  },
  email: {
    isValid: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: "올바른 이메일 주소를 입력하세요.",
  },
  password: {
    isValid: (value: string) =>
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/.test(value),
    errorMessage:
      "영문, 숫자, 특수문자를 포함하여 최소 8자리 이상 비밀번호를 입력하시기 바랍니다.",
  },
  phoneNum: {
    isValid: (value: string) => /^\d{3}-\d{4}-\d{4}$/.test(value),
    errorMessage: "올바른 전화번호를 입력하세요.",
  },
  jobRole: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "직무를 입력하세요.",
  },
  jobTitle: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "직함을 입력하세요.",
  },
  introduction: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "회원 소개를 입력하세요.",
  },
  remark: {
    isValid: (value: string) => value.trim() !== "",
    errorMessage: "회원 특이사항을 입력하세요.",
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
    isValid: (value: string) => value.length > 1,
    errorMessage: "이름은 최소 2자 이상 입력해야 합니다.",
  },
  jobRole: {
    isValid: (value: string) => value.length > 0,
    errorMessage: "직무를 입력해주세요.",
  },
  jobTitle: {
    isValid: (value: string) => value.length > 0,
    errorMessage: "직함을 입력해주세요.",
  },
  introduction: {
    isValid: (value: string) => value.length > 0,
    errorMessage: "회원 소개를 입력해주세요.",
  },
  remark: {
    isValid: (value: string) => value.length < 200,
    errorMessage: "특이사항은 최대 200자까지 입력 가능합니다.",
  },
};
