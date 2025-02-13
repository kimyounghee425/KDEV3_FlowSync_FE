"use client";

import { createContext, useContext, ReactNode } from "react";
import { useProjectInfo } from "@/src/hook/useFetchData";

interface ProjectInfoContextProps {
  data: any;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const ProjectInfoContext = createContext<ProjectInfoContextProps | undefined>(
  undefined,
);

export const ProjectInfoProvider = ({
  projectId,
  children,
}: {
  projectId: string;
  children: ReactNode;
}) => {
  const { data, loading, error, refetch } = useProjectInfo(projectId);

  return (
    <ProjectInfoContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </ProjectInfoContext.Provider>
  );
};

export const useProjectInfoContext = () => {
  const context = useContext(ProjectInfoContext);
  if (!context) {
    throw new Error(
      "useProjectInfoContext must be used within a ProjectInfoProvider",
    );
  }
  return context;
};
