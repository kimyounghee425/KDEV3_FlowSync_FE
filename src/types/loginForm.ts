export interface LoginFormData {
  label: string;
  id: string;
  type: "text" | "email" | "password" | "number" | "tel" | "url"; // 가능한 타입만 명시
  placeholder: string;
}
