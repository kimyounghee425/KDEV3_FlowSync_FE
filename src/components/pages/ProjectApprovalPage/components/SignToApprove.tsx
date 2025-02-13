import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Button, Image, Text } from "@chakra-ui/react";
import { bringSignApi, sendSignApi } from "@/src/api/signature";
import { useParams } from "next/navigation";
import { getMyOrgId } from "@/src/api/ReadArticle";
import SignaturePad from "signature_pad";
import DropDownInfoTop from "@/src/components/common/DropDownInfoTop";
import axiosInstance from "@/src/api/axiosInstance";

interface SigntoUploadProps {
  registerSignatureUrl?: string; // 요청자 사인 url
  approverSignatureUrl?: string;
  registerOrgId?: number;
}

export default function SignToApprove({
  registerSignatureUrl,
  approverSignatureUrl,
  registerOrgId,
}: SigntoUploadProps) {
  const { projectId, approvalId } = useParams() as {
    projectId: string;
    approvalId: string;
  };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
  const [yourSignatureUrl, setYourSignatureUrl] = useState<string>(approverSignatureUrl ?? ""); // 결재자 사인 url
  const [isSignatureComplete, setIsignatureComplete] = useState<boolean>(!!approverSignatureUrl);



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
      console.log("저장되었다리", responseData.data.url);
      disableSignaturePad(); // 서명 비활
      setIsignatureComplete(true);
      confirmApproval();
    } catch (error) {
      console.error("서명 등록 실패", error);
    }
  };

  const bringSignature = async () => {
    const isConfirmed = confirm("결재 서명을 입력하면 취소가 불가능합니다.");
    if (!isConfirmed) {
      return;
    }
    try {
      const responseData = await bringSignApi();
      if (responseData.code === 200 && responseData.data) {
        setYourSignatureUrl(responseData.data.signatureUrl ?? "");
        console.log("잘불러왔다리", responseData.data.signatureUrl);

        if (signaturePad) {
          // console.log(responseData.data.signatureUrl);
          signaturePad.fromDataURL(responseData.data.signatureUrl);
          disableSignaturePad(); // 비활
        }
        setIsignatureComplete(true);
      } else {
        console.log("못불러왔다리");
      }
      confirmApproval();
    } catch (error) {
      console.log("서명 불러오는데 오류 발생", error);
    }
  };

  // 승인 반려
  const rejectApproval = async () => {
    try {
      const response = await axiosInstance.post(
        `projects/${projectId}/approvals/${approvalId}/reject`,
      );
      if (response.data.result === "SUCCESS") {
        disableSignaturePad();
        setIsignatureComplete(true);
      }
      // return response.data.result;
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
      // return response.data.result;
    } catch (error) {
      console.error(error);
    }
  };

  // 자기 업체 글이면 결재자 서명 비활
  const isMyOrg = async () => {
    try {
      const response = await getMyOrgId();
      // console.log(response.data.organizationId, registerOrgId)
      if (response.data.organizationId === registerOrgId) {
        setIsignatureComplete(true);
        disableSignaturePad();
      }
    } catch (error) {
      console.log(error)
    }
  }

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
      {!isSignatureComplete && (
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
      )}

      <Flex direction={"row"} justifyContent={"center"} gap={4}>
        {!isSignatureComplete && (
          <Flex direction={"row"}>
            <Button mr={3} onClick={bringSignature}>
              서명 불러오기
            </Button>
            <Button mr={3} onClick={clearSignature}>
              지우기
            </Button>
            <Button mr={3} onClick={saveSignature}>
              등록
            </Button>
            <Button mr={3} backgroundColor={"red.200"} onClick={rejectApproval}>
              승인 반려
            </Button>
            <DropDownInfoTop
              text={`결재 글은 서명을 기입해야 작성이 가능합니다. \n "서명 불러오기" 는 기존에 저장된 서명을 불러옵니다. \n 새 서명을 기입하고 "등록" 을 누르면 기존에 저장되어 있던 서명은 삭제됩니다. `}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
