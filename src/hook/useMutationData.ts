import { useState } from "react";
import { showToast } from "@/src/utils/showToast";
import {
  ActivateMemberResponse,
  ApprovalRequestData,
  CommonResponseType,
  CreateMemberInput,
  CreateMemberResponse,
  CreateOrganizationInput,
  CreateOrganizationResponse,
  CreateProjectResponse,
  DeactivateMemberResponse,
  DeleteMemberResponse,
  DeleteOrganizationResponse,
  MemberProps,
  NoticeRequestData,
  OrganizationProps,
  ProgressAddProps,
  ProgressStep,
  ProgressStepOrder,
  QuestionRequestData,
} from "@/src/types";
import {
  createNoticeApi,
  deleteNoticeApi,
  editNoticeApi,
} from "@/src/api/notices";
import {
  updateProjectProgressStepScheduleApi,
  updateProjectProgressStepOrderApi,
  createProjectProgressStepApi,
  deleteProjectProgressStepApi,
  deleteProjectApi,
  updateProjectApi,
  createProjectApi,
  updateProjectProgressStepApi,
  projectManagementStepApi,
} from "@/src/api/projects";
import {
  changeOrganizationStatusApi,
  createOrganizationApi,
  deleteOriginationApi,
  updateOrganizationApi,
} from "@/src/api/organizations";
import {
  activateMemberApi,
  createMemberApi,
  deactivateMemberApi,
  deleteMemberApi,
  updateMemberApi,
} from "@/src/api/members";
import {
  createApprovalApi,
  createQuestionApi,
  deleteApprovalApi,
  deleteQuestionApi,
  editApprovalApi,
  updateQuestionApi,
} from "@/src/api/RegisterArticle";

interface UseMutationDataProps<T, P extends any[]> {
  mutationApi: (...args: P) => Promise<CommonResponseType<T>>;
}

/**
 * 데이터를 생성, 수정, 삭제하는 공통 훅.
 * - API 요청 및 로딩 상태, 에러 상태를 관리합니다.
 *
 * @template T - 응답 데이터 타입
 * @template P - API 함수의 매개변수 타입
 *
 * @param {UseMutationDataProps<T, P>} props 훅에 필요한 속성들
 * @returns mutate 함수, 로딩 상태, 에러 메시지
 */
export function useMutationData<T, P extends any[]>({
  mutationApi,
}: UseMutationDataProps<T, P>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (...args: P): Promise<CommonResponseType<T> | null> => {
    setLoading(true);
    try {
      const response = await mutationApi(...args);
      setError(null);

      // 성공 메시지가 있으면 토스트 띄우기
      if (response.message) {
        showToast({
          title: "요청 성공",
          description: response.message,
          type: "success",
          duration: 3000,
        });
      }
      return response;
    } catch (err: any) {
      // "API 요청 실패:"
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "요청 처리 중 오류가 발생했습니다.";

      showToast({
        title: "요청 실패",
        description: errorMessage,
        type: "error",
        duration: 3000,
        error: errorMessage,
      });

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

/**
 * 회원 생성 훅
 */
export function useCreateMember() {
  return useMutationData<CreateMemberResponse, [CreateMemberInput]>({
    mutationApi: createMemberApi,
  });
}

/**
 * 회원 수정 훅
 */
export function useUpdateMember() {
  return useMutationData<void, [string, Partial<MemberProps>]>({
    mutationApi: updateMemberApi,
  });
}

/**
 * 회원 삭제 훅
 */
export function useDeleteMember() {
  return useMutationData<DeleteMemberResponse, [string, string]>({
    mutationApi: deleteMemberApi,
  });
}

/**
 * 회원 상태 활성화로 변경 훅
 */
export function useActivateMemberStatus() {
  return useMutationData<ActivateMemberResponse, [string]>({
    mutationApi: activateMemberApi,
  });
}

/**
 * 회원 상태 비활성화로 변경 훅
 */
export function useDeactivateMemberStatus() {
  return useMutationData<DeactivateMemberResponse, [string]>({
    mutationApi: deactivateMemberApi,
  });
}

/**
 * 업체 생성 훅
 */
export function useCreateOrganization() {
  return useMutationData<
    CreateOrganizationResponse,
    [CreateOrganizationInput, any]
  >({
    mutationApi: createOrganizationApi,
  });
}

/**
 * 업체 수정 훅
 */
export function useUpdateOrganization() {
  return useMutationData<void, [string, Partial<OrganizationProps>, any]>({
    mutationApi: updateOrganizationApi,
  });
}

/**
 * 업체 삭제 훅
 */
export function useDeleteOrganization() {
  return useMutationData<DeleteOrganizationResponse, [string, string]>({
    mutationApi: deleteOriginationApi,
  });
}

/**
 * 업체 상태 변경 훅
 */
export function useUpdateOrganizationStatus() {
  return useMutationData<OrganizationProps, [string]>({
    mutationApi: changeOrganizationStatusApi,
  });
}

/**
 * 공지사항 생성 훅
 */
export function useCreateNotice() {
  return useMutationData<void, [NoticeRequestData]>({
    mutationApi: createNoticeApi,
  });
}

/**
 * 공지사항 수정 훅
 */
export function useEditNotice() {
  return useMutationData<void, [string, NoticeRequestData]>({
    mutationApi: editNoticeApi,
  });
}

/**
 * 공지사항 삭제 훅
 */
export function useDeleteNotice() {
  return useMutationData<void, [string]>({
    mutationApi: deleteNoticeApi,
  });
}

/**
 * 프로젝트 진행 단계 날짜 업데이트 훅
 */
export function useUpdateProjectProgressStepSchedule() {
  return useMutationData<
    ProgressStep,
    [string, string, { startAt: string; deadlineAt: string }]
  >({
    mutationApi: updateProjectProgressStepScheduleApi,
  });
}

/**
 * 프로젝트 진행 단계 순서 업데이트 훅
 */
export function useUpdateProjectProgressStepOrder() {
  return useMutationData<void, [string, ProgressStepOrder[]]>({
    mutationApi: updateProjectProgressStepOrderApi,
  });
}

/**
 * 프로젝트 진행 단계 추가 훅
 */
export function useCreateProjectProgressStep() {
  return useMutationData<void, [string, ProgressAddProps]>({
    mutationApi: createProjectProgressStepApi,
  });
}

/**
 * 프로젝트 진행 단계 삭제 훅
 */
export function useDeleteProjectProgressStep() {
  return useMutationData<void, [string, string]>({
    mutationApi: deleteProjectProgressStepApi,
  });
}

/**
 * 프로젝트 생성 훅
 */
export function useCreateProject() {
  return useMutationData<CreateProjectResponse, [any]>({
    mutationApi: createProjectApi,
  });
}

/**
 * 프로젝트 수정 훅
 */
export function useUpdateProject() {
  return useMutationData<CreateProjectResponse, [string, any]>({
    mutationApi: updateProjectApi,
  });
}

/**
 * 프로젝트 삭제 훅
 */
export function useDeleteProject() {
  return useMutationData<void, [string]>({
    mutationApi: deleteProjectApi,
  });
}
/*
 * 진행 단계 수정 훅
 */
export function useUpdateProjectProgressStep() {
  return useMutationData<void, [string, string, ProgressAddProps]>({
    mutationApi: updateProjectProgressStepApi,
  });
}

/**
 * 프로젝트 관리 단계 변경 훅
 */
export function useUpdateProjectManagementStep() {
  return useMutationData<void, [string, string]>({
    mutationApi: projectManagementStepApi,
  });
}

/**
 * 결재 게시글 생성 훅
 */
export function useCreateApproval() {
  return useMutationData<void, [number, ApprovalRequestData]>({
    mutationApi: createApprovalApi,
  });
}

/**
 * 결재 게시글 수정 훅
 */
export function useUpdateApproval() {
  return useMutationData<void, [number, number, ApprovalRequestData]>({
    mutationApi: editApprovalApi,
  });
}

/**
 * 결재 게시글 삭제 훅
 */
export function useDeleteApproval() {
  return useMutationData<void, [number, number]>({
    mutationApi: deleteApprovalApi,
  });
}

/**
 * 질문 게시글 생성 훅
 */
export function useCreateQuestion() {
  return useMutationData<void, [number, QuestionRequestData]>({
    mutationApi: createQuestionApi,
  });
}

/**
 * 질문 게시글 수정 훅
 */
export function useUpdateQuestion() {
  return useMutationData<void, [number, number, QuestionRequestData]>({
    mutationApi: updateQuestionApi,
  });
}

/**
 * 질문 게시글 삭제 훅
 */
export function useDeleteQuestion() {
  return useMutationData<void, [number, number]>({
    mutationApi: deleteQuestionApi,
  });
}
