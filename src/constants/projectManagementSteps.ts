// ENUM을 사용하여 프로젝트 상태 값 정의
export enum ProjectManagementSteps {
  ALL = "", // 전체
  CONTRACT = "CONTRACT", // 계약
  IN_PROGRESS = "IN_PROGRESS", // 진행중
  COMPLETED = "COMPLETED", // 납품완료
  MAINTENANCE = "MAINTENANCE", // 하자보수
  PAUSED = "PAUSED", // 일시중단
}
