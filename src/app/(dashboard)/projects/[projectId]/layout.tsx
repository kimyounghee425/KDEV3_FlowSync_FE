"use client";

import { ProjectInfoProvider } from "@/src/context/ProjectInfoContext";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

export default function ProjectLayout({ children }: layoutProps) {
  const { projectId } = useParams();
  return (
    <ProjectInfoProvider projectId={projectId as string}>
      {children}
    </ProjectInfoProvider>
  );
}
