// 업체 생성 페이지 - 입력 폼 초기값 설정
export const defaultValuesOfOrganizaion = {
  name: "",
  brNumber: "",
  streetAddress: "",
  detailAddress: "",
  phoneNumber: "",
  type: "CUSTOMER",
};

export const defaultValuesOfLogin = {
  email: "",
  password: "",
};

// 초기 입력값 세팅
export const defaultValuesOfMember = {
  organizationId: "1",
  name: "주농퐉",
  role: "MEMBER", // radio 버튼
  email: "user@example.com",
  password: "password1!", // <input> url 타입 기본 속성은 https:// 를 입력해야 돼서 초기값으로 세팅
  phoneNum: "010-9081-6109",
  jobRole: "개발자",
  jobTitle: "팀장",
  introduction: "안녕하세요. 주농퐉입니다.",
  remark: "특이사항 없습니다.",
};
