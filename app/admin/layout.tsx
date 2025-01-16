"use client";

import { Provider } from "@/src/components/ui/provider";
import { Box, Container, Flex } from "@chakra-ui/react";
import Header from "@/src/components/layouts/Header";
import Sidebar from "@/src/components/layouts/Sidebar";
import { MSWComponent } from "@/src/components/common/MSWComponent";
import { SidebarProvider } from "@/src/context/SidebarContext";

const RootLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return (
    <Provider>
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
    </Provider>
  );
};

export default RootLayout;
