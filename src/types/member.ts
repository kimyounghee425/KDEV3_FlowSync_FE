export interface MemberProps {
  email: string; // 회원 이메일
  id: string; // 회원 ID
  introduction: string;
  jobRole: string;
  jobTitle: string;
  name: string; // 회원 이름
  organizationId: string; // 회원 ID
  phoneNum: string;
  regAt: string;
  remark: string;
  role: string; // Enum: [ ADMIN, MEMBER ]
  status: string; // Enum: [ ACTIVE, INACTIVE ]
}