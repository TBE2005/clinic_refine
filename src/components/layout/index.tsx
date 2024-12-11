import { PropsWithChildren } from "react";
import { AppShell, Burger, Flex, Group, NavLink, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useGetIdentity, useMenu } from "@refinedev/core";
import { Link } from "react-router-dom";
import { ToggleTheme } from "../toggle-theme";
import ChangePassword from "../change-password";
import UserInfo from "../user-info";
import { Logout } from "../logout";
import { User } from "../../types";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const user = useGetIdentity<User>();

  const [opened, { toggle }] = useDisclosure();
  const menu = useMenu();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Flex justify={"space-between"} align="center">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group>
            <UserInfo />
            <ToggleTheme />
            <ChangePassword />
            <Logout />
          </Group>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {user?.data?.role === 'therapist' && (
          <NavLink
            component={Link}
            to={"/patient"}
            label={"Пациенты"}
            active={"/patient" === menu.selectedKey}
            // rightSection={item.icon}
            onClick={toggle}
          />
        )}
        {user?.data?.is_superuser && (
          <NavLink
            component={Link}
            to={"/users"}
            label={"Пользователи"}
            active={"/users" === menu.selectedKey}
            // rightSection={item.icon}
            onClick={toggle}
          />
        )}
         <NavLink
            component={Link}
            to={"/statistics"}
            label={"Статистика"}
            active={"/statistics" === menu.selectedKey}
            // rightSection={item.icon}
            onClick={toggle}
          />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
