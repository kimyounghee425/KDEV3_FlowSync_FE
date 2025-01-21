import { ReactNode } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";
import Header from "@/src/components/layouts/Header";
import Sidebar from "@/src/components/layouts/Sidebar";
import { SidebarProvider } from "@/src/context/SidebarContext";

interface MemberAndAdminDashboardLayoutProps {
  children: ReactNode;
}

export default function MemberAndAdminDashboardLayout({ children }: MemberAndAdminDashboardLayoutProps) {
  return (
    <>
      <Header />
      <Container
        maxWidth={"100%"}
        display="flex"
        flexDirection="row"
        margin={0}
        padding={0}>
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
