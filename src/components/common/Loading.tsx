import { Spinner, Text, VStack } from "@chakra-ui/react";

export const Loading = () => {
  return (
    <VStack colorPalette="teal" height="400px">
      <Spinner size="xl" color="colorPalette.gray" />
      <Text textStyle="xl" color="colorPalette.gray">
        Loading...
      </Text>
    </VStack>
  );
};
