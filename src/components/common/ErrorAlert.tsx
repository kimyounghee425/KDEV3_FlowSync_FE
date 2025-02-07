"use client";

import { Alert } from "@chakra-ui/react";

interface ErrorAlertProps {
  status?: "error" | "warning" | "info"; // 기본값 error
  message: string;
}

const ErrorAlert = ({ status = "error", message }: ErrorAlertProps) => {
  return (
    <Alert.Root status={status}>
      <Alert.Indicator />
      <Alert.Title>{message}</Alert.Title>
    </Alert.Root>
  );
};

export default ErrorAlert;
