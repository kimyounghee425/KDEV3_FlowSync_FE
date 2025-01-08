import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/src/components/ui/native-select";
import { ChangeEvent, ReactNode } from "react";

interface SelectBoxProps {
  children: ReactNode;
  placeholder: string;
  value: string;
  onChange?: (value: string) => void;
}

export const SelectBox: React.FC<SelectBoxProps> = ({
  children,
  placeholder,
  value,
  onChange,
}) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (onChange) {
      onChange(selectedValue); // 부모 컴포넌트로 선택된 값 전달
    }
  };

  return (
    <NativeSelectRoot size="md" width="240px">
      <NativeSelectField value={value} onChange={handleChange}>
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </NativeSelectField>
    </NativeSelectRoot>
  );
};
