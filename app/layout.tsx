import type { Metadata } from "next";

import { Provider as ChakraProvider } from "@/src/components/ui/provider";
import { MSWComponent } from "@/src/components/common/MSWComponent";

export const metadata: Metadata = {
  title: "FlowSync",
  description: "The World Best PMS Service",
};
const useMsw = process.env.USE_MSW === "true";

const RootLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return (
    <html suppressHydrationWarning>
      <body>
        <ChakraProvider>
          {useMsw ? <MSWComponent>{children}</MSWComponent> : children}
        </ChakraProvider>
      </body>
      {/* <body>{children}</body> */}
    </html>
  );
};

export default RootLayout;
