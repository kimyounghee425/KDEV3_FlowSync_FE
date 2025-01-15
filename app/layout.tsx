import type { Metadata } from "next";

import { Provider } from "@/src/components/ui/provider";
import { Box, Container, Flex } from "@chakra-ui/react";
import Header from "@/src/components/layouts/Header";
import Sidebar from "@/src/components/layouts/Sidebar";
import { MSWComponent } from "@/src/components/common/MSWComponent";
import { SidebarProvider } from "@/src/context/SidebarContext";

export const metadata: Metadata = {
  title: "FlowSync",
  description: "The World Best PMS Service",
};

const RootLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const useMsw = process.env.USE_MSW === "true";
  return (
    <html suppressHydrationWarning>
      {/* <body>{useMsw ? <MSWComponent>{children}</MSWComponent> : children}</body> */}
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
