import { ActionIcon, Tooltip } from "@mantine/core";
import { useLogout } from "@refinedev/core";
import { IconLogout } from "@tabler/icons-react";

export const Logout = () => {
  const logout = useLogout();
  return (
    <Tooltip label="Выйти">
      <ActionIcon
        onClick={() => logout.mutate()}
        variant="default"
        aria-label="Toggle color scheme"
      >
        <IconLogout />
      </ActionIcon>
    </Tooltip>
  );
};
