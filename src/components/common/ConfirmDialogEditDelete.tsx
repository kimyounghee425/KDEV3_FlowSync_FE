"use client";

import { Button } from "@chakra-ui/react";
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogCloseTrigger,
} from "@/src/components/ui/dialog";
import styles from "@/src/components/common/ActionButtons.module.css";

interface ConfirmDialogProps {
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  triggerText: string;
}

export default function ConfirmDialogEditDelete({
  onConfirm,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  triggerText,
}: ConfirmDialogProps) {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button className={styles.deleteButton}>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{description}</DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">{cancelText}</Button>
          </DialogActionTrigger>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
