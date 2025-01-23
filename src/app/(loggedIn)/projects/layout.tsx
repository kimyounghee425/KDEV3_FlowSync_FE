import { ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

export default function layout({ children }: layoutProps) {
  return <div>{children}</div>;
}
