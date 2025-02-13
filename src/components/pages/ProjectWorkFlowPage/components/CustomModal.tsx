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
  return (
    <DialogRoot size={size} placement="center" motionPreset={motionPreset}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
