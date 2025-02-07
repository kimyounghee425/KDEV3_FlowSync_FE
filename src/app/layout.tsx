import { ReactNode } from "react";
import type { Metadata } from "next";
import { Provider as ChakraProvider } from "@/src/components/ui/provider";
import { Toaster } from "@/src/components/ui/toaster";

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "FlowSync",
  description: "The World Best PMS Service",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning={true} data-theme="light">
      <body>
        <ChakraProvider>
          <Toaster />
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
