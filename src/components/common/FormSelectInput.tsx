import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface SelectInputProps<T> {
  label: string;
  selectedValue: T;
  setSelectedValue: (value: T) => void;
  options: {
    id: string | number;
    title: string;
    value?: string;
    count?: number;
  }[];
}

export default function SelectInput<T extends string | number | undefined>({
  label,
  selectedValue,
  setSelectedValue,
  options,
}: SelectInputProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value as T;
    setSelectedValue(selectedId);
  };

  return (
    <Box>
      <Text>{label}</Text>
      <select
        onChange={handleChange}
        value={selectedValue}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        <option value={""} disabled>
          {label} 선택
        </option>
        {options.map((option) => (
          <option key={String(option.id)} value={String(option.id)}>
            {option.title}
          </option>
        ))}
      </select>
    </Box>
  );
}
