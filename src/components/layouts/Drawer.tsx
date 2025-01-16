import { Button } from "@/src/components/ui/button";
import { DrawerActionTrigger, DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from "@/src/components/ui/drawer";
import Link from "next/link";

export default function Drawer() {
  return (
    <DrawerRoot>
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button variant="outline" size="lg">
          페이지 전환
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>이동하고 싶은 페이지를 선택하세요.</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <Link href="/">
            <Button>일반회원 - 홈 종합 대시보드</Button>
          </Link>
          <hr />
          <Link href="/projects/1">
            <Button>일반회원 - 프로젝트 개별 대시보드</Button>
          </Link>
          <hr />
          <Link href="/projects/1/tasks/new">
            <Button>일반회원 - 업무관리 게시글 - 작성</Button>
          </Link>
          <hr />
          <Link href="/projects/1/tasks/1/edit">
            <Button>일반회원 - 업무관리 게시글 - 수정</Button>
          </Link>
          <hr />
          <Link href="/login">
            <Button>공통 - 로그인 화면</Button>
          </Link>
          <hr />
          <Link href="/admin">
            <Button>관리자 - 홈 종합 대시보드</Button>
          </Link>
          <hr />
        </DrawerBody>
        <DrawerFooter>
          <DrawerActionTrigger asChild>
            <Button variant="outline">닫기</Button>
          </DrawerActionTrigger>
        </DrawerFooter>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
}
