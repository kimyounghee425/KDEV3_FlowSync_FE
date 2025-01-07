import { createContext, useState, useContext, useEffect } from "react";
import { fetchUserPermissions } from "@/src/api/auth";

interface Permissions {
  role: string; // 사용자 역할
}

interface PermissionsContextType {
  permissions: Permissions | null; // 권한 정보
  loading: boolean; // 로딩 상태
  fetchPermissions: () => Promise<void>; // 권한 다시 로드 함수
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await fetchUserPermissions(); // 유저 권한 가져오기
      setPermissions({ role: response.role }); // 권한 정보 설정
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      setPermissions(null); // 권한 초기화
    } finally {
      setLoading(false); // 로딩 상태 업데이트
    }
  };

  useEffect(() => {
    fetchPermissions(); // 초기 권한 로드
  }, []);

  return (
    <PermissionsContext.Provider
      value={{ permissions, loading, fetchPermissions }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};
