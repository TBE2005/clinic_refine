import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //make sure MRT styles were imported in your app root (once)
import {
  type MRT_ColumnDef,
  MRT_Table,
  useMantineReactTable,
} from "mantine-react-table";
import { ActionIcon, Group, Select, Text } from "@mantine/core";
import { useCreate, useDelete, useList } from "@refinedev/core";
import { User } from "../../types";
import React from "react";
import { IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import api from "../../axios";
import UserForm from "../../components/user-form";

const setRole = (user_id: string, new_role: string) => {
  return api.patch(`users/set_user_role`, null, {
    params: {
      user_id,
      new_role,
    },
  });
};

export const UserList = () => {
  const user = useCreate();
  const users = useList<User>({
    resource: "users/get_all",
    pagination: {
      mode: "off",
    },
  });

  const deleteUser = useDelete();

  const openModal = (user_id: string) =>
    modals.openConfirmModal({
      title: "Подтвердите удаление",
      children: (
        <Text size="sm">
          Это действие нельзя будет отменить. Это приведет к безвозвратному
          удалению данных пользователя и его пациентов.
        </Text>
      ),
      labels: { confirm: "Удалить", cancel: "Закрыть" },
      // onCancel: () => console.log("Cancel"),
      onConfirm: () =>
        api
          .delete(`users/deactivate`, {
            params: {
              user_id,
            },
          })
          .then(() => {
            users.refetch();
          }),
    });
  const columns = React.useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "username",
        header: "Имя пользователя",
      },
      {
        accessorKey: "role",
        header: "Роль",
        Cell: ({ cell }) => (
          <Select
            placeholder="Pick value"
            value={cell.getValue()}
            onChange={(val) => {
              setRole(cell.row.original.id, val).then(() => {
                users.refetch();
              });
            }}
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
        ),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: users.data?.data || [],
    createDisplayMode: "modal",
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableEditing: true,
    mantineTableProps: {
      highlightOnHover: false,
      striped: "odd",
      withColumnBorders: true,
      withRowBorders: true,
      withTableBorder: true,
    },
    onCreatingRowCancel: () => {},
    onCreatingRowSave: () => {},
    renderRowActions: ({ row: { original: user } }) => (
      <ActionIcon
        aria-label="delete"
        variant="default"
        onClick={() => openModal(user.id)}
      >
        <IconTrash color="red" />
      </ActionIcon>
    ),
  });

  //using MRT_Table instead of MantineReactTable if we do not want any of the toolbar features
  return (
    <Group>
      <UserForm
        handleSubmit={(values) =>
          user
            .mutateAsync({ resource: "auth/registration", values })
            .then(() => {
              users.refetch();
            })
        }
      />
      <MRT_Table table={table} />
    </Group>
  );
};

export default UserList;
