import type { Metadata } from "next";

import { MSWComponent } from "@/src/components/common/MSWComponent";

export const metadata: Metadata = {
  title: "FlowSync",
  description: "The World Best PMS Service",
};

const RootLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const useMsw = process.env.USE_MSW === "false";
  return (
    <html suppressHydrationWarning>
      <body>{useMsw ? <MSWComponent>{children}</MSWComponent> : children}</body>
      {/* <body>{children}</body> */}
    </html>
  );
};

export default RootLayout;
