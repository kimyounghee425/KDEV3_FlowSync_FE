"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Box, Input, Stack, Text } from "@chakra-ui/react";

const DEFAULT_COLORS: Record<string, string> = {
  CONTRACT: "#3498db",
  IN_PROGRESS: "#f1c40f",
  COMPLETED: "#2ecc71",
  MAINTENANCE: "#e67e22",
  PAUSED: "#9b59b6",
  DELETED: "#e74c3c",
};

const STATUS_LIST = [
  { key: "CONTRACT", label: "계약" },
  { key: "IN_PROGRESS", label: "진행중" },
  { key: "COMPLETED", label: "납품완료" },
  { key: "MAINTENANCE", label: "하자보수" },
  { key: "PAUSED", label: "일시중단" },
  { key: "DELETED", label: "삭제" },
];

export default function ColorCustomizer() {
  const [colors, setColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedColors = Cookies.get("statusColors");
    const parsedColors = savedColors ? JSON.parse(savedColors) : {};

    // ✅ 쿠키 값이 없으면 기본값 적용
    const updatedColors = { ...DEFAULT_COLORS, ...parsedColors };
    setColors(updatedColors);

    // ✅ 초기 로드 시 기본 색상 적용 (CSS 변수 설정)
    Object.entries(updatedColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(
        `--${key.toLowerCase()}-color`,
        value as string,
      );
    });

    // ✅ 쿠키 값이 없으면 기본값을 쿠키에 저장
    if (!savedColors) {
      Cookies.set("statusColors", JSON.stringify(DEFAULT_COLORS), {
        expires: 30,
      });
    }
  }, []);

  const handleColorChange = (status: string, color: string) => {
    const newColors = { ...colors, [status]: color };
    setColors(newColors);
    Cookies.set("statusColors", JSON.stringify(newColors), { expires: 30 });
    document.documentElement.style.setProperty(
      `--${status.toLowerCase()}-color`,
      color,
    );
  };

  return (
    <Stack gap={2} direction="row">
      {STATUS_LIST.map(({ key, label }) => (
        <Box key={key} textAlign="center">
          <Text fontSize="sm">{label}</Text> {/* ✅ 한글 라벨 표시 */}
          <Input
            type="color"
            value={colors[key] || "#ffffff"}
            onChange={(e) => handleColorChange(key, e.target.value)}
            width="40px"
            height="40px"
            p={0}
            border="none"
          />
        </Box>
      ))}
    </Stack>
  );
}
