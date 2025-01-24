import { useEffect, useState } from "react";
import { fetchProjectInfo } from "@/src/api/projects";
import { useParams } from "next/navigation";
import { ProjectInfoProps } from "@/src/types";

/**
 * 프로젝트 정보를 가져오는 커스텀 훅
 */
export function useProjectInfo() {
  const [projectInfo, setProjectInfo] = useState<ProjectInfoProps | null>(null);
  const [loading, setLoading] = useState(true);

  const { projectId } = useParams();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);

        const response = await fetchProjectInfo(projectId as string);
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
