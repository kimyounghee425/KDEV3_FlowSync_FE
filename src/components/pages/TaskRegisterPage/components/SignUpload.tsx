import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Button, Image, Text } from "@chakra-ui/react";
import { bringSignApi, sendSignApi } from "@/src/api/signature";
import SignaturePad from "signature_pad";
import DropDownInfoTop from "@/src/components/common/DropDownInfoTop";

export default function SignUpload() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);

  const [signatureUrl, setSignatureUrl] = useState<string>("");

  // 캔버스 초기화
  useEffect(() => {
    if (canvasRef.current) {
      setSignaturePad(new SignaturePad(canvasRef.current));
    }
  }, []);

  // 서명 지우기
  const clearSignature = () => {
    signaturePad?.clear();
  };

  // 서명 저장
  const saveSignature = async () => {
    if (!signaturePad || signaturePad.isEmpty()) {
      alert("서명을 입력하세요");
      return;
    }
    const signatureData = signaturePad.toDataURL("image/png");
    // Base64 -> blob 변환
    const byteString = atob(signatureData.split(",")[1]);
    const mimeType = signatureData.split(",")[0].split(":")[1].split(";")[0];

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: mimeType });
    const file = new File([blob], "signature.png", { type: mimeType });

    try {
      const responseData = await sendSignApi(file);
      setSignatureUrl(responseData.data.url);
      console.log("저장되었다리", responseData.data.url);
    } catch (error) {
      console.error("서명 등록 실패", error);
    }
  };

  const bringSignature = async () => {
    try {
      const responseData = await bringSignApi();
      if (responseData.code === 200 && responseData.data) {
        setSignatureUrl(responseData.data.signatureUrl ?? "");
        console.log("잘불러왔다리", responseData.data.signatureUrl);

        if (signaturePad) {
          // console.log(responseData.data.signatureUrl);
          signaturePad.fromDataURL(responseData.data.signatureUrl);
        }
      } else {
        console.log("못불러왔다리");
      }
    } catch (error) {
      console.log("서명 불러오는데 오류 발생", error);
    }
  };

  return (
    <Flex direction={"column"} align="center">
      <Flex direction="column" align="center">
        <Text>결재요청자 서명</Text>
        <Box border={"2px solid black"} borderRadius={"10px"}>
          {signatureUrl ? (
            <Image width={250} height={166.6} src={signatureUrl} alt="서명" />
          ) : (
            <Text
              display="flex"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              width={250}
              height={166.6}
              color="gray.500"
            >
              서명을 불러와 주세요
            </Text>
          )}
        </Box>
      </Flex>
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
      <Flex justifyContent={"center"} gap={4}>
        <Button onClick={bringSignature}>서명 불러오기</Button>
        <Button onClick={clearSignature}>지우기</Button>
        <Button onClick={saveSignature}>등록</Button>
        <DropDownInfoTop
          text={`결재 글은 서명을 기입해야 작성이 가능합니다. \n "서명 불러오기" 는 기존에 저장된 서명을 불러옵니다. \n 새 서명을 기입하고 "등록" 을 누르면 기존에 저장되어 있던 서명은 삭제됩니다. `}
        />
      </Flex>
    </Flex>
  );
}
