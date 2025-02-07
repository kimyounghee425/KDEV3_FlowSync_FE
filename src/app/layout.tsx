import { ReactNode } from "react";
import type { Metadata } from "next";
import { Provider as ChakraProvider } from "@/src/components/ui/provider";
import { Toaster } from "@/src/components/ui/toaster";

// import { MSWComponent } from "@/src/components/common/MSWComponent";

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "FlowSync",
  description: "The World Best PMS Service",
};

// const useMsw = process.env.USE_MSW === "true";

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ChakraProvider>
          <Toaster />
          {/* {useMsw ? <MSWComponent>{children}</MSWComponent> : children} */}
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
