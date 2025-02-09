"use client";

import { Button } from "@chakra-ui/react";
import styles from "@/src/styles/ActionButtons.module.css";

interface ButtonRegisterProps {
  isLoading: boolean;
  onSubmit: () => void;
}

export default function ButtonRegister({
  isLoading,
  onSubmit,
}: ButtonRegisterProps) {
  return (
    <Button
      type="button"
      className={`${styles.registerButton} ${isLoading ? styles.loading : ""}`}
      onClick={onSubmit}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? "처리 중..." : "등록하기"}
    </Button>
  );
}
