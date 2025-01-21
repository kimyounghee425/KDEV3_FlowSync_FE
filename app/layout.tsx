import { ReactNode } from "react";
import type { Metadata } from "next";
import { Provider as ChakraProvider } from "@/src/components/ui/provider";
// import { MSWComponent } from "@/src/components/common/MSWComponent";

export const metadata: Metadata = {
  title: "FlowSync",
  description: "The World Best PMS Service",
};


// const useMsw = process.env.USE_MSW === "true";

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html suppressHydrationWarning>
      <body>
        <ChakraProvider>
          {/* {useMsw ? <MSWComponent>{children}</MSWComponent> : children} */}
          {children}
        </ChakraProvider>
      </body>
    </html>
  );

};



