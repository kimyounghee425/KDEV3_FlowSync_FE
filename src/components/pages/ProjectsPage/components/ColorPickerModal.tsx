"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Stack, Button, SimpleGrid } from "@chakra-ui/react";
import { SketchPicker, ColorResult } from "react-color";
import ColorPickerButton from "@/src/components/pages/ProjectsPage/components/ColorPickerButton";

const DEFAULT_COLORS: Record<string, string> = {
  CONTRACT: "rgba(52, 152, 219, 1)", // RGBA 형식으로 변경
  IN_PROGRESS: "rgba(241, 196, 15, 1)",
  COMPLETED: "rgba(46, 204, 113, 1)",
  MAINTENANCE: "rgba(230, 126, 34, 1)",
  PAUSED: "rgba(155, 89, 182, 1)",
  DELETED: "rgba(231, 76, 60, 1)",
};

const STATUS_LIST = [
  { key: "CONTRACT", label: "계약" },
  { key: "IN_PROGRESS", label: "진행중" },
  { key: "COMPLETED", label: "납품완료" },
  { key: "MAINTENANCE", label: "하자보수" },
  { key: "PAUSED", label: "일시중단" },
  { key: "DELETED", label: "삭제" },
];

export default function ColorPickerModal() {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    const savedColors = Cookies.get("statusColors");
    const parsedColors = savedColors ? JSON.parse(savedColors) : {};

    const updatedColors = { ...DEFAULT_COLORS, ...parsedColors };
    setColors(updatedColors);

    Object.entries(updatedColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(
        `--${key.toLowerCase()}-color`,
        value as string,
      );
    });

    if (!savedColors) {
      Cookies.set("statusColors", JSON.stringify(DEFAULT_COLORS), {
        expires: 30,
      });
    }
  }, []);

  const handleColorChange = (color: ColorResult) => {
    if (!selectedKey) return;

    const rgbaColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;

    const newColors = { ...colors, [selectedKey]: rgbaColor };
    setColors(newColors);
    Cookies.set("statusColors", JSON.stringify(newColors), { expires: 30 });

    document.documentElement.style.setProperty(
      `--${selectedKey.toLowerCase()}-color`,
      rgbaColor,
    );
  };

  const resetColors = () => {
    Cookies.set("statusColors", JSON.stringify(DEFAULT_COLORS), {
      expires: 30,
    });
    setColors(DEFAULT_COLORS);
    Object.entries(DEFAULT_COLORS).forEach(([key, value]) => {
      document.documentElement.style.setProperty(
        `--${key.toLowerCase()}-color`,
        value,
      );
    });
  };

  return (
    <Stack gap={6} direction="column" alignItems="center" width="100%">
      <SimpleGrid columns={3} gap={4} width="100%">
        {STATUS_LIST.map(({ key, label }) => (
          <ColorPickerButton
            key={key}
            label={label}
            color={colors[key] || "#ffffff"}
            isSelected={selectedKey === key}
            onClick={() =>
              setSelectedKey((prev) => (prev === key ? null : key))
            }
          />
        ))}
      </SimpleGrid>

      {selectedKey && (
        <SketchPicker
          color={colors[selectedKey]}
          onChange={handleColorChange}
          disableAlpha={false}
        />
      )}

      <Button
        width="140px"
        size="md"
        backgroundColor="#e4e4e7"
        _hover={{ backgroundColor: "#d1d1d6" }}
        onClick={resetColors}
        alignSelf="center"
      >
        초기화
      </Button>
    </Stack>
  );
}
