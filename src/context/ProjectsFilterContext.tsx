"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface ProjectsFilterProps {
  filter: string;
  setFilter: (value: string) => void;
}

const ProjectsFilterContext = createContext<ProjectsFilterProps | undefined>(
  undefined
);

export const ProjectsFilterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [filter, setFilter] = useState<string>("all");

  return (
    <ProjectsFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </ProjectsFilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(ProjectsFilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
