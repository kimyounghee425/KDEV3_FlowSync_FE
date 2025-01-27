import { useEffect, useState } from "react";
import { fetchProjectQuestionProgressStep as fetchProjectQuestionProgressStepApi } from "@/src/api/projects";

/**
 * 프로젝트 진척 정보를 담는 타입 정의
 * - id: 진척 항목 식별자
 * - title: 진척 항목 제목
 * - count: 해당 항목에 대한 수치(진척도, 작업 수 등)
 */
interface QuestionProgressStepType {
  id: string;
  title: string;
  count: number;
}

/**
 * useProgressData 훅:
 * - projectId에 해당하는 프로젝트의 진척 데이터를 로드
 * - 로딩 상태, 에러 상태도 함께 관리
 *
 * @param projectId 가져올 프로젝트 ID
 * @returns
 *   - progressData: 프로젝트 진척 항목 배열
 *   - loading: 로딩 여부
 *   - error: 에러 메시지 (없으면 null)
 */
export function useProjectQuestionProgressStep(projectId: string) {
  // 진척 정보 데이터를 저장할 상태
  const [progressStep, setProgressStep] = useState<QuestionProgressStepType[]>(
    [],
  );
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 컴포넌트가 마운트되거나 projectId가 변경될 때마다
   * 해당 프로젝트의 단계 데이터를 API로부터 가져옴
   */
  useEffect(() => {
    const fetchProjectQuestionProgressStep = async () => {
      try {
        setLoading(true);
        setError(null);

        // 서버로부터 프로젝트 단계 정보 가져오기
        const response = await fetchProjectQuestionProgressStepApi(projectId);
        setProgressStep(response.data);
      } catch (err) {
        console.error("Failed to fetch progress data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectQuestionProgressStep();
  }, [projectId]);

  return { progressStep, loading, error };
}
