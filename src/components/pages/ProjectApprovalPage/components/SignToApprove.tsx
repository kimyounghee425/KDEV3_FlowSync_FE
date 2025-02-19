import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Button, Image, Text } from "@chakra-ui/react";
import { bringSignApi, sendSignApi } from "@/src/api/signature";
import { useParams } from "next/navigation";
import { getMyOrgId } from "@/src/api/ReadArticle";
import SignaturePad from "signature_pad";
import DropDownInfoTop from "@/src/components/common/DropDownInfoTop";
import axiosInstance from "@/src/api/axiosInstance";
import { getMeApi } from "@/src/api/getMembersApi";
import { showToast } from "@/src/utils/showToast";

interface SigntoUploadProps {
  registerSignatureUrl?: string; // 요청자 사인 url
  approverSignatureUrl?: string;
  registerOrgId?: number;
  customerOwnerName: string;
}

export default function SignToApprove({
  registerSignatureUrl,
  approverSignatureUrl,
  registerOrgId,
  customerOwnerName,
}: SigntoUploadProps) {
  const { projectId, approvalId } = useParams() as {
    projectId: string;
    approvalId: string;
  };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
  const [yourSignatureUrl, setYourSignatureUrl] = useState<string>(
    approverSignatureUrl ?? "",
  ); // 결재자 사인 url
  const [isSignatureComplete, setIsignatureComplete] =
    useState<boolean>(!!approverSignatureUrl);
  const [signing, setSigning] = useState<boolean>(false);
  const [newSigning, setNewSigning] = useState<boolean>(false);
  const [myName, setMyName] = useState<string>("");

  // 캔버스 초기화
  useEffect(() => {
    isMyOrg();
    if (approverSignatureUrl) {
      setIsignatureComplete(true); // 서명이 이미 존재하면 다시 입력할 수 없도록 설정
      setYourSignatureUrl(approverSignatureUrl); // 서명 이미지도 업데이트
    }

    if (canvasRef.current) {
      setSignaturePad(new SignaturePad(canvasRef.current));
    }
  }, [approverSignatureUrl]);

  const handleNewSign = () => {
    setNewSigning(true);

    setTimeout(() => {
      if (canvasRef.current) {
        setSignaturePad(new SignaturePad(canvasRef.current));
      }
      enableSignaturePad(); // 🔥 여기서 다시 활성화!
    }, 100);
  };

  const enableSignaturePad = () => {
    if (signaturePad) {
      signaturePad.on();
    }
  };

  // 서명 지우기
  const clearSignature = () => {
    signaturePad?.clear();
  };

  const setCanvasBackground = (color: string) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = color; // ✅ 배경색 설정
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); // ✅ 캔버스 전체를 색으로 채움
      }
    }
  };

  // 서명 패드 비활성화
  const disableSignaturePad = () => {
    if (signaturePad) {
      signaturePad.off();
      setCanvasBackground("#E0E0E0");
    }
  };

  // 서명 저장
  const saveSignature = async () => {
    if (!signaturePad || signaturePad.isEmpty()) {
      alert("서명을 입력하세요");
      return;
    }
    const isConfirmed = confirm("결재 서명을 입력하면 취소가 불가능합니다.");
    if (!isConfirmed) {
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
      disableSignaturePad(); // 서명 비활
      setIsignatureComplete(true);
      confirmApproval();
    } catch (error) {
      console.error("서명 등록 실패", error);
    }
  };

  const bringSignature = async () => {
    try {
      const responseData = await bringSignApi();
      if (responseData.data.hasSignatures === false) {
        const errorMessage = "서명이 없습니다. 서명을 등록하세요.";
        showToast({
          title: "요청 실패",
          description: errorMessage,
          type: "error",
          duration: 3000,
          error: errorMessage,
        });
        return;
      }
      const isConfirmed = confirm("결재 서명을 입력하면 취소가 불가능합니다.");
      if (!isConfirmed) {
        return;
      }

      setYourSignatureUrl(responseData.data.signatureUrl ?? "");

      if (signaturePad) {
        signaturePad.fromDataURL(responseData.data.signatureUrl);
        disableSignaturePad(); // 비활
      }
      setIsignatureComplete(true);

      confirmApproval();
    } catch (error) {
      console.error("서명 불러오는데 오류 발생", error);
    }
  };

  // 승인 반려
  const rejectApproval = async () => {
    const isConfirmed = window.confirm("결재를 반려하시겠습니까?");
    if (!isConfirmed) {
      return;
    }
    try {
      const response = await axiosInstance.post(
        `projects/${projectId}/approvals/${approvalId}/reject`,
      );
      if (response.data.result === "SUCCESS") {
        disableSignaturePad();
        setIsignatureComplete(true);
        setYourSignatureUrl("./public/reject.jpg");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 승인
  const confirmApproval = async () => {
    try {
      const response = await axiosInstance.post(
        `projects/${projectId}/approvals/${approvalId}/confirm`,
      );
      if (response.data.result === "SUCCESS") {
        disableSignaturePad();
        setIsignatureComplete(true);
      }
      // return response.data.result;g
    } catch (error) {
      console.error(error);
    }
  };

  // 자기 업체 글이면 결재자 서명 비활
  const isMyOrg = async () => {
    try {
      const response = await getMeApi();

      if (response.data.organizationType === "DEVELOPER") {
        setIsignatureComplete(true);
        disableSignaturePad();
      } else {
        setMyName(response.data.name);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(myName, customerOwnerName)
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
            {registerSignatureUrl ? (
              <Image
                width={250}
                height={166.6}
                src={registerSignatureUrl}
                alt="서명"
              />
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
                결재자 서명
              </Text>
            )}
          </Box>
          <Box border={"2px solid black"} borderRadius={"10px"}>
            {yourSignatureUrl ? (
              <Image
                width={250}
                height={166.6}
                src={yourSignatureUrl}
                alt="서명"
                objectFit="contain"
              />
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
      </Flex>
      {!isSignatureComplete &&
        (newSigning ? (
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
        ) : (
          <Box pt={5}></Box>
        ))}

      {myName === customerOwnerName ? (
        <Flex direction={"row"} justifyContent={"center"} gap={4}>
          {!isSignatureComplete && (
            <Flex direction={"row"}>
              {!signing ? (
                <Button
                  onClick={() => setSigning(true)}
                  backgroundColor={"blue.500"}
                  color="white"
                  _hover={{ backgroundColor: "blue.600" }}
                  mr={2}
                >
                  결재
                </Button>
              ) : !newSigning ? (
                <Flex direction={"row"}>
                  <Button
                    backgroundColor={"green.500"}
                    color="white"
                    _hover={{ backgroundColor: "green.600" }}
                    mr={3}
                    onClick={bringSignature}
                  >
                    서명 불러오기
                  </Button>
                  <Button
                    backgroundColor={"blue.500"}
                    color="white"
                    _hover={{ backgroundColor: "blue.600" }}
                    mr={2}
                    onClick={handleNewSign}
                  >
                    서명 새로 작성하기
                  </Button>
                </Flex>
              ) : (
                <Flex direction={"row"}>
                  <Button
                    backgroundColor={"blue.500"}
                    color="white"
                    _hover={{ backgroundColor: "blue.600" }}
                    mr={3}
                    onClick={saveSignature}
                  >
                    등록
                  </Button>
                  <Button
                    backgroundColor={"red.500"}
                    color="white"
                    _hover={{ backgroundColor: "red.600" }}
                    mr={3}
                    onClick={clearSignature}
                  >
                    지우기
                  </Button>
                </Flex>
              )}

              <Button
                mr={3}
                backgroundColor={"red.200"}
                onClick={rejectApproval}
              >
                반려
              </Button>
              <DropDownInfoTop
                text={`결재 글은 서명을 기입해야 작성이 가능합니다. \n "서명 불러오기" 는 기존에 저장된 서명을 불러옵니다. \n 새 서명을 기입하고 "등록" 을 누르면 기존에 저장되어 있던 서명은 삭제됩니다. `}
              />
            </Flex>
          )}
        </Flex>
      ) : null}
    </Flex>
  );
}
