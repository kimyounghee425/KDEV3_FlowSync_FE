"use client";

import { Button } from "@chakra-ui/react";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

interface CustomModalProps {
  title: string;
  triggerText: string;
  children: React.ReactNode;
  size?: "cover" | "md" | "lg" | "xl";
  motionPreset?: "slide-in-bottom" | "scale" | "none";
}

export default function CustomModal({
  title,
  triggerText,
  children,
  size = "md",
  motionPreset = "slide-in-bottom",
}: CustomModalProps) {
  const sizeMap = {
    sm: { width: "500px", height: "350px" }, // ✅ 기존보다 100px 증가
    md: { width: "700px", height: "450px" },
    lg: { width: "900px", height: "550px" },
    xl: { width: "1100px", height: "650px" },
    "2xl": { width: "1300px", height: "750px" },
    "3xl": { width: "1500px", height: "850px" },
    full: { width: "95vw", height: "95vh" }, // ✅ 화면 95% 차지
    cover: { width: "85vw", height: "85vh" }, // ✅ 적당한 크기로 조절
  };

  return (
    <DialogRoot size={size} placement="center" motionPreset={motionPreset}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent
        style={{
          width: sizeMap[size]?.width || "600px",
          height: sizeMap[size]?.height || "400px",
          maxWidth: "95vw", // ✅ 너무 커지는 것 방지
          maxHeight: "95vh", // ✅ 화면 초과 방지
          overflowY: "auto", // ✅ 내부 내용이 많으면 스크롤 가능
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
