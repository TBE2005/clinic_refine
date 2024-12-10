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
        {menu.menuItems.map((item) =>
          user?.data?.is_superuser && item.name === "users" ? (
            <NavLink
              component={Link}
              key={item.key}
              to={item.route ?? "/"}
              label={item.label}
              active={item.key === menu.selectedKey}
              rightSection={item.icon}
              onClick={toggle}
            />
          ) : (
            <NavLink
              component={Link}
              key={item.key}
              to={item.route ?? "/"}
              label={item.label}
              active={item.key === menu.selectedKey}
              rightSection={item.icon}
              onClick={toggle}
            />
          )
        )}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
