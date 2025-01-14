export interface OrganizationProps {
  id: number;
  type: string;
  status: string;
  brNumber: string | null;
  orgName: string;
  reg_at: string;
  brCertificateUrl: string | null;
  streetAddress: string | null;
  detailAddress: string | null;
  phone_number: string | null;
  remark: string | null;
}
