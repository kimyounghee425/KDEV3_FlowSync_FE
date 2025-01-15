"use client";

import { Box, Button, Flex, Heading, HStack, Separator, Span, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { login } from "@/src/api/auth";
import LoginInputForm from "../../common/LoginInputForm";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    setError(null); // 에러 메시지 초기화
    setIsLoading(true); // 로딩 상태 활성화

    try {
      const { token, user } = await login(formData.email, formData.password);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      route.push("/"); // 대시보드 리다이렉트
    } catch (err: any) {
      setError(err.message || "로그인 실패");
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" padding="1.5" bg="gray.50">
      {/* 제목 */}
      <Flex direction="column" align="center" fontWeight="medium" gap="2.5" marginBottom="8">
        <Span fontSize="8xl">📄</Span>
        <Heading fontSize="4xl" fontWeight="medium">
          BN SYSTEM
        </Heading>
        <Heading fontSize="lg" fontWeight="medium" color="gray.600" textAlign="center">
          기업 회원 전용 페이지에 오신 것을 환영합니다!
        </Heading>
      </Flex>

      {/* 로그인 폼 */}
      <Box display="flex" flexDirection="column" width="90%" maxW="400px" padding="6" border="1px" borderColor="gray.300" borderRadius="md" bg="white" boxShadow="sm" gap="3">
        <form onSubmit={handleSubmit}>
          <Flex direction="column" align="center" gap="2">
            <LoginInputForm id="email" type="email" label="Email address" placeholder="이메일을 입력하세요." onChange={e => handleChange("email", e.target.value)} />
            <LoginInputForm id="password" type="password" label="Password" placeholder="패스워드를 입력하세요." onChange={e => handleChange("password", e.target.value)} />

            {error && <span style={{ color: "red" }}>{error}</span>}

            <Button type="submit" backgroundColor="#00a8ff" color="white" fontSize="lg" fontWeight="medium" width="100%" disabled={isLoading} _hover={{ backgroundColor: "#007acc" }}>
              로그인
            </Button>
          </Flex>
        </form>
        <HStack width="100%" gap="4" justify="center">
          <Text>
            <Link href="/login/find-password">비밀번호 찾기</Link>
          </Text>
          <Separator orientation="vertical" height="4" />
          <Text>아이디 찾기</Text>
          <Separator orientation="vertical" height="4" />
          <Text>회원가입</Text>
        </HStack>
      </Box>
    </Flex>
  );
}

// "use client";

// import { Box, Button, Flex, Heading, HStack, Separator, Span, Text } from "@chakra-ui/react";
// import React, { useState, useTransition } from "react";
// import { login } from "@/src/api/auth";
// import LoginInputForm from "../../common/LoginInputForm";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// interface User {
//   id: string;
//   name: string;
// }

// export default function LoginPage() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState<string | null>(null);
//   const [isPending, startTransition] = useTransition();
//   const route = useRouter();

//   const handleChange = (field: string, value: string) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) {
//       setError("이메일과 비밀번호를 모두 입력하세요.");
//       return;
//     }

//     setError(null); // 에러 메시지 초기화
//     startTransition(async () => {
//       try {
//         const response: { token: string; user: { id: string; name: string } } = await login(formData.email, formData.password);
//         localStorage.setItem("authToken", response.token);
//         localStorage.setItem("user", JSON.stringify(response.user));
//         // window.location.href = "/";
//         // TODO 홈화면 프리패칭 적용하기
//         route.push("/"); // 홈(종합 대시보드)로 리다이렉트
//       } catch (err: any) {
//         setError(err.message || "로그인 실패");
//       } finally {
//       }
//     });
//   };

//   return (
//     <Flex direction="column" align="center" justify="center" minH="100vh" padding="1.5" bg="gray.50">
//       {/* 제목 */}
//       <Flex direction="column" align="center" fontWeight="medium" gap="2.5" marginBottom="8">
//         <Span fontSize="8xl">📄</Span>
//         <Heading fontSize="4xl" fontWeight="medium">
//           BN SYSTEM
//         </Heading>
//         <Heading fontSize="lg" fontWeight="medium" color="gray.600" textAlign="center">
//           기업 회원 전용 페이지에 오신 것을 환영합니다!
//         </Heading>
//       </Flex>

//       {/* 로그인 폼 */}
//       <Box display="flex" flexDirection="column" width="90%" maxW="400px" padding="6" border="1px" borderColor="gray.300" borderRadius="md" bg="white" boxShadow="sm" gap="3">
//         <form onSubmit={handleSubmit}>
//           <Flex direction="column" align="center" gap="2">
//             <LoginInputForm id="email" type="email" label="Email address" placeholder="이메일을 입력하세요." onChange={e => handleChange("email", e.target.value)} />
//             <LoginInputForm id="password" type="password" label="Password" placeholder="패스워드를 입력하세요." onChange={e => handleChange("password", e.target.value)} />

//             {error && <span style={{ color: "red" }}>{error}</span>}

//             <Button type="submit" backgroundColor="#00a8ff" color="white" fontSize="lg" fontWeight="medium" width="100%" disabled={isPending} _hover={{ backgroundColor: "#007acc" }}>
//               로그인
//             </Button>
//           </Flex>
//         </form>
//         <HStack width="100%" gap="4" justify="center">
//           <Text>
//             <Link href="/login/find-password">비밀번호 찾기</Link>
//           </Text>
//           <Separator orientation="vertical" height="4" />
//           <Text>아이디 찾기</Text>
//           <Separator orientation="vertical" height="4" />
//           <Text>회원가입</Text>
//         </HStack>
//       </Box>
//     </Flex>
//   );
// }
