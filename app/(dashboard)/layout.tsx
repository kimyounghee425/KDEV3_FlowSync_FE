import { ReactNode } from "react";
import type { Metadata } from "next";
import { Box, Container, Flex } from "@chakra-ui/react";
import Header from "@/src/components/layouts/Header";
import Sidebar from "@/src/components/layouts/Sidebar";
import { SidebarProvider } from "@/src/context/SidebarContext";

export const metadata: Metadata = {
  title: "FlowSync",
  description: "The World Best PMS Service",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Container maxWidth={"100%"} display="flex" flexDirection="row" margin={0} padding={0}>
        <SidebarProvider>
          <Sidebar />
        </SidebarProvider>
        <Flex width="100%" height="100%" align="center" justify="center">
          <Box maxW="container.xl" width="100%" height="100%" p={10}>
            {children}
          </Box>
        </Flex>
      </Container>
    </>
  );
}
