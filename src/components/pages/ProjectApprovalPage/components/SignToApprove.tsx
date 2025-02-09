import React, { useRef, useState } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import SignaturePad from "signature_pad";

export default function SignToApprove() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);

  // 캔버스 초기화
  React.useEffect(() => {
    if (canvasRef.current) {
      const pad = new SignaturePad(canvasRef.current);
      setSignaturePad(pad);
    }
  }, []);

  // 서명 지우기
  const clearSignature = () => {
    signaturePad?.clear();
  };

  // 이미지 저장
  const saveSignature = () => {
    if (signaturePad) {
      const dataURL = signaturePad.toDataURL("image/png"); // PNG 파일로 저장
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "서명.png";
      link.click();
    }
  };

  return (
    <Flex direction={"column"}>
      <Box mb={5}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={{
            border: "2px solid black",
            borderRadius: "10px",
            width: "600px",
            height: "400px",
          }}
        />
      </Box>
      <Box display={"flex"} justifyContent={"center"}>
        <Button mr={10} onClick={clearSignature}>지우기</Button>
        <Button onClick={saveSignature}>저장</Button>
      </Box>
    </Flex>
  );
}
