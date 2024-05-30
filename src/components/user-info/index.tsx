import { Popover, ActionIcon, Tooltip, Text } from "@mantine/core";
import { useGetIdentity } from "@refinedev/core";
import { IconUser } from "@tabler/icons-react";
import { User } from "../../types";
const labelRoles = {
  therapist: "Врач",
  explorer: "Исследователь",
};
const UserInfo = () => {
  const user = useGetIdentity<User>();

  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Tooltip label="Данные пользователя">
          <ActionIcon variant="default" aria-label="change password">
            <IconUser />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="lg">{user?.data?.username}</Text>
        <Text size="xl">
          {user?.data?.role ? labelRoles[user?.data?.role] : ""}
        </Text>
        {user.data?.is_superuser && <Text size="xs">Админ</Text>}
      </Popover.Dropdown>
    </Popover>
  );
};

export default UserInfo;
