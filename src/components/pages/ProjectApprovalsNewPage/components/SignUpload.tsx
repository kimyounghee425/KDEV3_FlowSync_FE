import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Button, Image, Text } from "@chakra-ui/react";
import { bringSignApi, sendSignApi } from "@/src/api/signature";
import { showToast } from "@/src/utils/showToast";

import SignaturePad from "signature_pad";

interface SignUploadProps {
  setIsSignYes: (bool: boolean) => void;
}

export default function SignUpload({ setIsSignYes }: SignUploadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [signing, setSigning] = useState<boolean>(false);
  const [newSigning, setNewSigning] = useState<boolean>(false);

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
      // console.log("저장되었다리", responseData.data.url);
      setIsSignYes(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "서명을 등록하는 중 오류가 발생했습니다.";

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
      setSignatureUrl(responseData.data.signatureUrl ?? "");

      if (signaturePad) {
        // console.log(responseData.data.signatureUrl);
        signaturePad.fromDataURL(responseData.data.signatureUrl);
      } else {
        console.log("못불러왔다리");
      }
      setIsSignYes(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "서명을 불러오는 중 오류가 발생했습니다.";

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
          <Box
            border={"2px solid black"}
            borderRadius={"10px"}
            backgroundColor={"gray.300"}
          >
            <Text
              display="flex"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              width={250}
              height={166.6}
              color="gray.500"
            >
              결재자 서명이 입력될 칸입니다.
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
        {!signing ? (
          <>
            <Button
              backgroundColor={"green.500"}
              color="white"
              _hover={{ backgroundColor: "green.600" }}
              mr={2}
              onClick={bringSignature}
            >
              서명 불러오기
            </Button>
            <Button
              backgroundColor={"blue.500"}
              color="white"
              _hover={{ backgroundColor: "blue.600" }}
              mr={2}
              onClick={() => {
                const isConfirmed = window.confirm(
                  `서명을 새로 등록하면 기존의 서명이 덮어씌워집니다. \n 새로 등록하시겠습니까?`,
                );
                if (isConfirmed) {
                  setSigning(true);
                }
              }}
            >
              서명 새로 등록하기
            </Button>
          </>
        ) : (
          <>
            <Button
              backgroundColor={"blue.500"}
              color="white"
              _hover={{ backgroundColor: "blue.600" }}
              mr={2}
              onClick={saveSignature}
            >
              등록
            </Button>
            <Button
              backgroundColor={"red.500"}
              color="white"
              _hover={{ backgroundColor: "red.600" }}
              mr={2}
              onClick={clearSignature}
            >
              지우기
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
}
