import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Button, Image, Text } from "@chakra-ui/react";
import { bringSignApi, sendSignApi } from "@/src/api/signature";
import SignaturePad from "signature_pad";
import DropDownInfoTop from "@/src/components/common/DropDownInfoTop";
import { showToast } from "@/src/utils/showToast";

interface EditSignUploadProps {
  signatureUrl: string;
}

export default function EditSignUpload({ signatureUrl }: EditSignUploadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
  const [yourSignatureUrl, setYourSignatureUrl] =
    useState<string>(signatureUrl);

  // 캔버스 초기화
  useEffect(() => {
    if (canvasRef.current) {
      const pad = new SignaturePad(canvasRef.current);
      setSignaturePad(pad);

      if (signatureUrl) {
        pad.fromDataURL(signatureUrl);
      }
    }
  }, [signatureUrl]);

  // 서명 지우기
  const clearSignature = () => {
    signaturePad?.clear();
  };

  // 서명 저장
  const saveSignature = async () => {
    if (!signaturePad || signaturePad.isEmpty()) {
      const errorMessage = "서명을 입력하세요.";
      showToast({
        title: "요청 실패",
        description: errorMessage,
        type: "error",
        duration: 3000,
        error: errorMessage,
      });
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
      setYourSignatureUrl(responseData.data.url);
    } catch (error) {
      const errorMessage = "서명 등록에 실패했습니다.";
      showToast({
        title: "요청 실패",
        description: errorMessage,
        type: "error",
        duration: 3000,
        error: errorMessage,
      });
    }
  };

  const bringSignature = async () => {
    try {
      const responseData = await bringSignApi();

      setYourSignatureUrl(responseData.data.signatureUrl ?? "");

      if (signaturePad) {
        signaturePad.fromDataURL(responseData.data.signatureUrl);
      }
    } catch (error) {
      const errorMessage = "서명을 불러오는데 오류가 발생했습니다.";
      showToast({
        title: "요청 실패",
        description: errorMessage,
        type: "error",
        duration: 3000,
        error: errorMessage,
      });
    }
  };

  return (
    <Flex direction={"column"} align="center">
      <Flex direction="column" align="center">
        <Flex direction={"row"}>
          <Flex
            width="250px"
            justifyContent="center"
            alignItems="center"
            mr="20px"
          >
            <Text>요청자 담당</Text>
          </Flex>
          <Flex width="250px" justifyContent="center" alignItems="center">
            <Text>결재자 담당</Text>
          </Flex>
        </Flex>
        <Flex direction={"row"}>
          <Box border={"2px solid black"} borderRadius={"10px"} mr="20px">
            {yourSignatureUrl ? (
              <Image
                width={250}
                height={166.6}
                src={yourSignatureUrl}
                alt="서명"
              />
            ) : (
              <Image
                width={250}
                height={166.6}
                src={signatureUrl}
                alt="기존 서명"
              />
            )}
          </Box>
          <Box border={"2px solid black"} borderRadius={"10px"}>
            <Text
              display="flex"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              width={250}
              height={166.6}
              color="gray.500"
            >
              결재자 서명
            </Text>
          </Box>
        </Flex>
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
