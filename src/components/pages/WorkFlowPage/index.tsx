"use client";

import { ProjectLayout } from "@/src/components/layouts/ProjectLayout";
import GuideButton from "@/src/components/common/GuideButton";

export default function WorkflowPage() {
  return (
    <ProjectLayout>
      프로젝트 진척관리 페이지
      <GuideButton
        label="도움말"
        guideText="* 이 페이지는 추후 개발이 진행될 예정입니다. 참고 부탁드립니다"
        position={{ top: "20%", right: "20%" }}
      />
    </ProjectLayout>
  );
}
