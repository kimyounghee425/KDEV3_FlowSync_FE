import { Avatar } from "@/src/components/ui/avatar";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { ProfileProps } from "@/src/types/profile";

const Profile: React.FC<ProfileProps> = ({ id, userName, orgName, jobRole, profile_image_url }) => {
  // const direction = isSidebar ? "column" : "row";
  // const marginBottom = isSidebar ? "15px" : "0px";
  return (
    <Box>
      <Stack>
        <HStack key={id}>
          <Avatar name={userName} size="lg" src={profile_image_url} />
          <Stack gap="1" direction="row">
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
