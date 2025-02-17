// 결재 글 열람 페이지
"use client";

// 외부 라이브러리
import { Box, VStack, Flex, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// 절대 경로 파일
import ArticleContent from "@/src/components/common/ArticleContent";
import ArticleComments from "@/src/components/common/ArticleComments";
import CommentBox from "@/src/components/common/CommentBox";
import { readApprovalApi } from "@/src/api/ReadArticle";
import SignToApprove from "@/src/components/pages/ProjectApprovalPage/components/SignToApprove";
import { ArticleComment, ApprovalArticle } from "@/src/types";
import { deleteApprovalApi } from "@/src/api/RegisterArticle";
import DropDownMenu from "@/src/components/common/DropDownMenu";
import DropDownInfoBottom from "../../common/DropDownInfoBottom";

export default function ProjectApprovalPage() {
  const { projectId, approvalId } = useParams() as {
    projectId: string;
    approvalId: string;
  };
  const router = useRouter();

  const [article, setArticle] = useState<ApprovalArticle | null>(null);
  const [category, setCategory] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [commentList, setCommentList] = useState<ArticleComment[]>([]);
  const [commentIsWritten, setCommentIsWritten] = useState<boolean>(false);
  const [registerSignatureUrl, setRegisterSignatureUrl] = useState<string>();
  const [approverSignatureUrl, setApproverSignatureUrl] = useState<string>();
  const [registerOrgId, setRegisterOrgId] = useState<number>(); // 자기 업체 글인지 확인

  useEffect(() => {
    const loadApproval = async () => {
      try {
        const responseData = await readApprovalApi(
          Number(projectId),
          Number(approvalId),
        );
        setArticle(responseData);
        setCategory(responseData.category);
        setCommentList(responseData.commentList ?? []);
        setRegisterSignatureUrl(responseData.register.signatureUrl);
        if (responseData.status === "APPROVED") {
          setApproverSignatureUrl(responseData.approver?.signatureUrl);
        } else if (responseData.status === "REJECTED") {
          setApproverSignatureUrl("/비추_고화질.png")
        } else {
          setApproverSignatureUrl(responseData.approver?.signatureUrl);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 가져오는데 실패했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadApproval();
  }, [projectId, approvalId, commentIsWritten]);

  if (error) {
    return <Box>에러 발생: {error}</Box>;
  }

  if (loading) {
    return <Box>로딩 중...</Box>;
  }

  const handleEdit = () => {
    if (approverSignatureUrl !== undefined) {
      alert("결재가 완료된 글은 수정할 수 없습니다.");
      return;
    }
    router.push(`/projects/${projectId}/approvals/${approvalId}/edit`);
  };

  const handleDelete = async () => {
    if (approverSignatureUrl !== undefined) {
      alert("결재가 완료된 글은 삭제할 수 없습니다.");
      return;
    }

    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;
    try {
      await deleteApprovalApi(Number(projectId), Number(approvalId));
      alert("게시글이 삭제되었습니다.");
      router.push(`/projects/${projectId}/approvals`);
    } catch (error) {
      alert(`삭제 중 문제가 발생했습니다 : ${error}`);
    }
  };
  return (
    <Box
      maxW="1000px"
      w="100%"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <Flex
        justifyContent="space-between"
        marginBottom="1rem"
        alignItems="center"
      >
        {/* <Image src={signatureUrl} alt="signature" width="100px" height="auto" /> */}
        <DropDownMenu onEdit={handleEdit} onDelete={handleDelete} />
      </Flex>
      {/* 게시글 내용 */}
      {category === "NORMAL_REQUEST" ? (
        <Text fontSize={"xl"} fontWeight={"bold"} color={"blue"} mb={2}>
          일반 요청
        </Text>
      ) : (
        <Text fontSize={"xl"} fontWeight={"bold"} color={"red"} mb={2}>
          진행단계 완료 요청
        </Text>
      )}
      <ArticleContent article={article} />

      <Box display={"flex"} direction={"row"} alignItems={"center"}>
        <Text fontWeight="bold" pr={2}>
          서명
        </Text>
        <DropDownInfoBottom
          text={`결재 글은 서명을 기입해야 결재가 완료됩니다. \n "서명 불러오기" 는 기존에 저장된 서명을 불러옵나다. \n 새 서명을 기입하고 "등록" 을 누르면 기존에 저장되어 있던 서명은 삭제됩니다.`}
        />
      </Box>
      <Box display={"flex"} direction={"column"} justifyContent={"center"}>
        <SignToApprove
          registerSignatureUrl={registerSignatureUrl}
          approverSignatureUrl={approverSignatureUrl}
          registerOrgId={registerOrgId}
        />
      </Box>

      {/* 댓글 섹션 */}
      <VStack align="stretch" gap={8} mt={10}>
        <ArticleComments
          comments={commentList}
          setCommentIsWritten={setCommentIsWritten}
        />
        <CommentBox setCommentIsWritten={setCommentIsWritten} />
      </VStack>
    </Box>
  );
}
