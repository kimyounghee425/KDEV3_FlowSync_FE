import { Button } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/src/components/ui/dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <DialogContent
        style={{
          position: "fixed", // 화면 고정
          top: "50%", // 화면 세로 중앙 정렬
          left: "50%", // 화면 가로 중앙 정렬
          transform: "translate(-50%, -50%)", // 정확한 중앙 정렬
          padding: "24px", // 내부 패딩 추가
          borderRadius: "12px", // 둥근 모서리
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // 그림자 효과 추가
          backgroundColor: "white", // 배경색 (다크모드 고려 시 Chakra의 `useColorModeValue` 사용 가능)
          width: "400px", // 고정된 너비 설정
          maxHeight: "250px", // 모달 길이 제한
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <DialogCloseTrigger
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            backgroundColor: "white", // X 버튼 배경을 흰색으로
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          ✖
        </DialogCloseTrigger>

        <DialogHeader>
          <DialogTitle
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {title}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <p
            style={{ textAlign: "center", fontSize: "16px", margin: "10px 0" }}
          >
            {description}
          </p>
        </DialogBody>

        <DialogFooter
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
          }}
        >
          {/* 확인 버튼 (더 길고 가독성 좋게) */}
          <Button
            onClick={onConfirm}
            loading={isLoading}
            loadingText="처리 중..."
            colorScheme="blue"
            disabled={isLoading}
            style={{
              width: "100%", // 버튼을 더 길게 설정
              padding: "12px",
              fontSize: "16px",
            }}
          >
            {confirmText}
          </Button>
          {/* 취소 버튼 (더 길고 가독성 좋게) */}
          <DialogActionTrigger asChild>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              style={{
                width: "100%", // 버튼을 더 길게 설정
                padding: "12px",
                fontSize: "16px",
              }}
            >
              {cancelText}
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
