import {
  ActionIcon,
  Button,
  Group,
  PasswordInput,
  Radio,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLock, IconUser, IconWand } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UserForm = ({handleSubmit}: {handleSubmit: any;}) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      password: "",
      username: "",
      role: "therapist",
    },
    validate: {
      username: (value) =>
        value.length < 5 ? "Name must have at least 5 letters" : null,
      password: (value) =>
        value.length < 5 ? "Name must have at least 5 letters" : null,
    },
  });

  return (
    <form onSubmit={form.onSubmit((val) => handleSubmit(val))}>
      <TextInput
        placeholder="Имя пользователя"
        key={form.key("username")}
        {...form.getInputProps("username")}
        leftSection={<IconUser />}
        rightSection={
          <ActionIcon
            aria-label="generate"
            variant="subtle"
            onClick={() =>
              form.setValues({
                username: "Username" + (Math.random() * 100).toFixed(0),
                password: Math.random().toString(36).slice(2, 10),
              })
            }
          >
            <IconWand />
          </ActionIcon>
        }
      />
      <PasswordInput
        mt="sm"
        placeholder="Пароль"
        key={form.key("password")}
        {...form.getInputProps("password")}
        leftSection={<IconLock />}
      />

      <Select
        mt="sm"
        placeholder="Pick value"
        key={form.key("role")}
        {...form.getInputProps("role")}
        data={[
          {
            label: "Исследователь",
            value: "explorer",
          },
          {
            label: "Врач",
            value: "therapist",
          },
        ]}
      />
      <Button type="submit" mt={"sm"} w={"100%"}>
        Добавить
      </Button>
    </form>
  );
};

export default UserForm;
