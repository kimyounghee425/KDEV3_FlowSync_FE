import { Avatar } from "@/src/components/ui/avatar";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { ProfileProps } from "@/src/types/profile";

const Profile: React.FC<ProfileProps> = ({
  id,
  userName,
  orgName,
  jobRole,
  avatar,
  isSidebar,
}) => {
  const direction = isSidebar ? "column" : "row";
  const marginBottom = isSidebar ? "15px" : "0px";
  return (
    <Box margin={marginBottom}>
      <Stack>
        <HStack key={id}>
          <Avatar name={userName} size="lg" src={avatar} />
          <Stack gap="1" direction={direction}>
            <Text fontWeight="medium">{userName}</Text>
            <Text color="gray.600" textStyle="sm">
              {orgName} · {jobRole}
            </Text>
          </Stack>
        </HStack>
      </Stack>
    </Box>
  );
};

export default Profile;
