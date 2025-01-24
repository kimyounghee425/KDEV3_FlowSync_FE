import { useEffect, useState } from "react";
import { fetchProjectInfo } from "@/src/api/projects";
import { useSearchParams } from "next/navigation";

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

/**
 * 프로젝트 정보를 가져오는 커스텀 훅
 */
export function useProjectInfo() {
  // 추출한 프로젝트 ID를 저장할 상태
  const [projectInfo, setProjectInfo] = useState<ProjectInfoType | null>(null);
  const [loading, setLoading] = useState(true);

  const projectId = useSearchParams().get("projectId") || "";

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);

        const response = await fetchProjectInfo(projectId);
        setProjectInfo(response.data);
      } catch (err) {
        console.error("Failed to fetch project data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  return { projectId, projectInfo, loading };
}
