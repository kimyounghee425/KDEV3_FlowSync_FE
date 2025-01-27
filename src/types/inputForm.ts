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
