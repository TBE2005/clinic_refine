import { useForm } from "@mantine/form";
import { TextInput, Button, PasswordInput, Center } from "@mantine/core";
import { useLogin } from "@refinedev/core";

export const Login = () => {
  const login = useLogin();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { username: "", password: "" },
    // functions will be used to validate values at corresponding key
    validate: {
      username: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      password: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });
  return (
    <Center h={"100vh"}>
      <form onSubmit={form.onSubmit((values) => login.mutate(values))}>
        <TextInput
          label="Имя пользователя"
          placeholder="Имя пользователя"
          key={form.key("username")}
          {...form.getInputProps("username")}
        />
        <PasswordInput
          mt="sm"
          label="Пароль"
          placeholder="Пароль"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />

        <Button type="submit" mt="sm" w={"100%"}>
          Войти
        </Button>
      </form>
    </Center>
  );
};
