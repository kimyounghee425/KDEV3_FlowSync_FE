"use client";

import DaumPostcode from "react-daum-postcode";
import React from "react";
import { Box, Button } from "@chakra-ui/react";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (address: string) => void;
}

export default function AddressAPI({
  isOpen,
  onClose,
  onComplete,
}: AddressModalProps) {
  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname) extraAddress += data.bname; // 법정동
      if (data.buildingName)
        extraAddress += extraAddress
          ? `, ${data.buildingName}`
          : data.buildingName; // 건물명 추가

      fullAddress += extraAddress ? ` (${extraAddress})` : "";
    }

    onComplete(fullAddress); // 선택된 주소를 부모 컴포넌트로 전달
    onClose(); // 모달 닫기
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.header}>주소 검색</h2>
        <button style={styles.closeButton} onClick={onClose}>✖</button>
        <Box>
          <DaumPostcode onComplete={handleComplete} autoClose={false} />
        </Box>
      </div>
    </div>
  );
};

// 스타일 객체
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    width: "400px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    position: "relative",
  },
  header: {
    margin: "0 0 10px 0",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    background: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
};

