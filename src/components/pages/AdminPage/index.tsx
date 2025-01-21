"use client";

import { Suspense } from "react";
import ProjectsPageContent2 from "@/src/components/common/ProjectsPageContent2";

export default function AdminPage() {
  return (
    <Suspense>
      <ProjectsPageContent2 />
    </Suspense>
  );
}
