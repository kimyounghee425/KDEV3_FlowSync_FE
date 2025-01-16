import { useEffect, useState } from "react";
import { fetchProjectInfo } from "@/src/api/projects";

interface ProjectInfoType {
  projectTitle: string; // 프로젝트명
  jobRole: string; // 직무
  profileImageUrl: string; // 프로필 이미지 URL
  name: string; // 담당자 이름
  jobTitle: string; // 직급
  phoneNum: string; // 연락처
  projectStartAt: string; // 프로젝트 시작일
  projectCloseAt: string; // 프로젝트 종료일
}

export function useProjectInfo(params: Promise<{ projectId: string }>) {
  const [projectId, setProjectId] = useState<string>();
  const [projectInfo, setProjectInfo] = useState<ProjectInfoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);

        // `params`에서 `projectId` 추출 및 프로젝트 정보 가져오기
        const { projectId } = await params;
        setProjectId(projectId); // projectId 상태 업데이트

        // 프로젝트 정보 가져오기
        const response = await fetchProjectInfo(projectId);
        setProjectInfo(response.data); // 데이터 저장
      } catch (err) {
        console.error("Failed to fetch project data:", err);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchProjectData();
  }, [params]);

  return { projectId, projectInfo, loading };
}
