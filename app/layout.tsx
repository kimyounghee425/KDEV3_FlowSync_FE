import type { Metadata } from "next";

import { MSWComponent } from "@/src/components/common/MSWComponent";

export const metadata: Metadata = {
  title: "FlowSync",
  description: "The World Best PMS Service",
};

const RootLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  
  const useMsw = process.env.USE_MSW === "true"; // 이거 껐다켰다 하는 식으로 사용해야..?

  return (
    <html suppressHydrationWarning>
      <body>{useMsw ? <MSWComponent>{children}</MSWComponent> : children}</body>
      {/* <body>{children}</body> */}
    </html>
  );
};

export default RootLayout;
