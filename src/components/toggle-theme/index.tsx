import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Tooltip,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export const ToggleTheme = () => {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <Tooltip label="Сменить тему">
      <ActionIcon
        onClick={() => {
          setColorScheme(computedColorScheme === "light" ? "dark" : "light");
        }}
        variant="default"
        aria-label="Toggle color scheme"
      >
        {colorScheme === "light" ? <IconMoon /> : <IconSun />}
      </ActionIcon>
    </Tooltip>
  );
};
