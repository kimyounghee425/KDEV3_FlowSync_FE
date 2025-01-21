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

/**
 * 프로젝트 정보를 가져오는 커스텀 훅
 *
 * @param params Promise<{ projectId: string }>
 *   - 비동기로 projectId를 추출할 수 있는 객체 (예: Next.js의 'params' 등)
 * @returns
 *   - projectId: 현재 프로젝트의 ID
 *   - projectInfo: 프로젝트 정보 (ProjectInfoType)
 *   - loading: 로딩 상태 (true/false)
 */
export function useProjectInfo(params: Promise<{ projectId: string }>) {
  // 추출한 프로젝트 ID를 저장할 상태
  const [projectId, setProjectId] = useState<string>();
  // 프로젝트 정보를 저장할 상태
  const [projectInfo, setProjectInfo] = useState<ProjectInfoType | null>(null);
  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);

  /**
   * 컴포넌트 마운트/업데이트 시점에서
   * 프로젝트 ID를 추출하고, 해당 프로젝트 정보를 가져오는 비동기 함수
   */
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
