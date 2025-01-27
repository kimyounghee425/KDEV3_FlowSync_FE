// 업체 생성 페이지 - 입력 폼 초기값 설정
export const defaultValuesOfOrganizaion = {
  name: "비엔시스템",
  brNumber: "123-45-67890",
  brCertificateUrl: "https://www.naver.com",
  streetAddress: "서울시 강남구",
  detailAddress: "역삼동",
  phoneNumber: "010-9081-6109",
  type: "CUSTOMER",
};

export const defaultValuesOfLogin = {
  email: "",
  password: "",
};

// 초기 입력값 세팅
export const defaultValuesOfMember = {
  organizationId: "123e4567-e89b-12d3-a456-426614174000",
  name: "",
  role: "MEMBER", // radio 버튼
  email: "",
  password: "https://", // <input> url 타입 기본 속성은 https:// 를 입력해야 돼서 초기값으로 세팅
  phoneNum: "",
  jobRole: "",
  jobTitle: "",
  introduction: "",
  remark: "",
};
