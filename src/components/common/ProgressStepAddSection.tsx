import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface ProgressStepAddsectionProps {
  progressStepId: number;
  setProgressStepId: React.Dispatch<React.SetStateAction<number>>;
  progressData: { id: number; title: string }[];
}

export default function ProgressStepAddSection({
  progressStepId,
  setProgressStepId,
  progressData,
}: ProgressStepAddsectionProps) {
  const handleStepChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);

    setProgressStepId(selectedId);
  };
  console.log(progressStepId);
  return (
    <Box>
      <Text>진행 단계 선택</Text>
      <select
        onChange={handleStepChange}
        defaultValue={""}
        value={progressStepId}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        <option value={""} disabled>
          단계를 선택하세요
        </option>
        {progressData.map((step) => (
          <option key={step.id} value={step.id}>
            {step.title}
          </option>
        ))}
      </select>
    </Box>
  );
}
