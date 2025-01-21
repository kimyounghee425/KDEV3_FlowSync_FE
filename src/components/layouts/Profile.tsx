import { Avatar } from "@/src/components/ui/avatar";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
// import { ProfileProps } from "@/src/types/profile";

export interface ProfileProps {
  id: number;
  userName: string;
  orgName?: string;
  jobRole?: string;
  profile_image_url?: string;
}

export default function Profile({
  id,
  userName,
  orgName = "Unknown",
  jobRole = "N/A",
  profile_image_url,
}: ProfileProps) {
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
}
