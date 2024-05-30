import {
  Popover,
  ActionIcon,
  Button,
  PasswordInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconLockCancel,
  IconLockOpen,
  IconLockOpenOff,
} from "@tabler/icons-react";
import api from "../../axios";

const ChangePassword = () => {
  const form = useForm({
    mode: "uncontrolled",
    validate: {
      old_password: (value) =>
        value.length < 2 ? "Name must have at least 6 letters" : null,
      new_password: (value) =>
        value.length < 2 ? "Name must have at least 6 letters" : null,
    },
  });
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Tooltip label="Изменить пароль">
          <ActionIcon variant="default" aria-label="change password">
            <IconLockOpenOff />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <form
          onSubmit={form.onSubmit(async (values) => {
            await api.patch("users/change_password", values);
          })}
        >
          <PasswordInput
            mt="sm"
            label="Текущий пароль"
            placeholder="Текущий"
            key={form.key("old_password")}
            {...form.getInputProps("old_password")}
            leftSection={<IconLockCancel />}
          />
          <PasswordInput
            mt="sm"
            label="Новый пароль"
            placeholder="Новый"
            key={form.key("new_password")}
            {...form.getInputProps("new_password")}
            leftSection={<IconLockOpen />}
          />

          <Button type="submit" mt="sm" w={"100%"}>
            Изменить
          </Button>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ChangePassword;
