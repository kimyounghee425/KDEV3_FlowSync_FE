"use client";

import { useState } from "react";

export default function AdminCreateMemberPage() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <>
      {/* 로그인 폼
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

      <Box borderWidth="1px" rounded="lg" shadow="1px 1px 3px rgba(0,0,0,0.3)" maxWidth={800} p={6} m="10px auto" as="form">
        <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
          User Registration
        </Heading>
        <Flex>
          <FormControl mr="5%">
            <FormLabel htmlFor="first-name" fontWeight={"normal"}>
              First name
            </FormLabel>
            <Input id="first-name" placeholder="First name" />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="last-name" fontWeight={"normal"}>
              Last name
            </FormLabel>
            <Input id="last-name" placeholder="First name" />
          </FormControl>
        </Flex>
        <FormControl mt="2%">
          <FormLabel htmlFor="email" fontWeight={"normal"}>
            Email address
          </FormLabel>
          <Input id="email" type="email" />
          <FormHelperText>We&apos;ll never share your email.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
            Password
          </FormLabel>
          <InputGroup size="md">
            <Input pr="4.5rem" type={show ? "text" : "password"} placeholder="Enter password" />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </Box> */}
    </>
  );
}
