export interface MemberProps {
  id: string; // 회원 ID
  organizationId: string; // 회원 ID
  email: string; // 회원 이메일
  name: string; // 회원 이름
  role: string; // Enum: [ ADMIN, MEMBER ]
  phoneNum: string;
  jobRole: string;
  jobTitle: string;
  status: string; // Enum: [ ACTIVE, INACTIVE ]
  loginFailCount: number;
  isLoginLockedYn: string;
}
