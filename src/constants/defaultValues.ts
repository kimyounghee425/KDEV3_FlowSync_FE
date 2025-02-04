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
  organizationId: "",
  name: "",
  role: "", // radio 버튼
  email: "",
  password: "", // <input> url 타입 기본 속성은 https:// 를 입력해야 돼서 초기값으로 세팅
  phoneNum: "",
  jobRole: "",
  jobTitle: "",
  introduction: "",
  remark: "",
};
