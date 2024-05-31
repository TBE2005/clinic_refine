import { ActionIcon, Box, Button, Flex, List, Tooltip } from "@mantine/core";
import {
  useCreate,
  useGetIdentity,
  useList,
  useNavigation,
} from "@refinedev/core";
import { Patient, User } from "../../types";
import {
  IconDownload,
  IconEdit,
  IconEye,
  IconPlus,
  IconUsers,
  IconUsersPlus,
} from "@tabler/icons-react";
import {
  MRT_ColumnDef,
  MRT_RowVirtualizer,
  MRT_SortingState,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import React from "react";

// @ts-ignore
import { mkConfig, generateCsv, download } from "export-to-csv"; //or use your library of choice here

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

export const PatientList = () => {
  const navigation = useNavigation();
  const user = useGetIdentity<User>();
  const patientsByTherapist = useList<Patient>({
    resource:
      "patient/get_all_by_therapist?" +
      new URLSearchParams({
        limit: "10000",
      }),
    pagination: {
      mode: "off",
    },
  });
  const allPatients = useCreate();
  const rowVirtualizerInstanceRef = React.useRef<MRT_RowVirtualizer>(null);
  const [data, setData] = React.useState<Patient[]>([]);
  const [sorting, setSorting] = React.useState<MRT_SortingState>([]);
  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data as any);
    download(csvConfig)(csv);
  };
  const columns = React.useMemo<MRT_ColumnDef<Patient>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: "ФИО",
      },
      {
        accessorKey: "birthday",
        header: "Дата рождения",
        filterVariant: "date-range",
      },
      {
        accessorKey: "gender",
        header: "Пол",
        filterFn: "equals",
        mantineFilterSelectProps: {
          data: [
            {
              label: "Мужской",
              value: "м",
            },
            {
              label: "Женский",
              value: "ж",
            },
          ],
        },
        filterVariant: "select",
      },
      {
        accessorKey: "job_title",
        header: "Должность",
      },
      {
        accessorKey: "inhabited_locality",
        header: "Населенный пункт",
        mantineFilterSelectProps: {
          data: [
            {
              label: "Город",
              value: "Город",
            },
            {
              label: "Район",
              value: "Район",
            },
          ],
        },
        filterVariant: "select",
      },
      {
        accessorKey: "living_place",
        header: "Место жительства",
      },
      {
        accessorKey: "bp",
        header: "Бп",
        Cell: ({ cell }) => (cell.getValue() ? "Да" : "Нет"),
        filterVariant: "checkbox",
      },
      {
        accessorKey: "ischemia",
        header: "Ишемия",
        Cell: ({ cell }) => (cell.getValue() ? "Да" : "Нет"),
        filterVariant: "checkbox",
      },
      {
        accessorKey: "dep",
        header: "Дэп",
        Cell: ({ cell }) => (cell.getValue() ? "Да" : "Нет"),
        filterVariant: "checkbox",
      },
    ],
    []
  );
  const table = useMantineReactTable({
    columns,
    data: data,
    enableBottomToolbar: false,
    enableColumnVirtualization: true,
    enableGlobalFilterModes: true,
    enablePagination: false,
    enableColumnPinning: true,
    enableRowVirtualization: true,
    enableEditing: true,
    mantineTableContainerProps: { style: { maxHeight: "600px" } },
    onSortingChange: setSorting,
    state: { isLoading: patientsByTherapist.isLoading, sorting },
    rowVirtualizerInstanceRef, //optional
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 2 }, //optionally customize the column virtualizer
    renderTopToolbarCustomActions: () => (
      <Box
        style={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          onClick={() => navigation.create("patient")}
          rightSection={<IconPlus />}
        >
          Добавить
        </Button>
        {user.data?.is_superuser && (
          <>
            <Button
              onClick={() => setData(patientsByTherapist?.data?.data ?? [])}
              rightSection={<IconUsersPlus />}
            >
              Мои пациенты
            </Button>
            <Button
              onClick={async () => {
                await allPatients.mutateAsync({
                  resource: "patient/get_all?limit=10000",
                  values: {},
                });
                setData(allPatients.data?.data.patients ?? []);
              }}
              rightSection={<IconUsers />}
            >
              Все пациенты
            </Button>
          </>
        )}

        <Button
          onClick={handleExportData}
          rightSection={<IconDownload />}
          variant="filled"
        >
          Экспорт
        </Button>
      </Box>
    ),
    renderRowActions: ({ row }) => (
      <Flex gap="xs">
        <Tooltip label="Редактировать">
          <ActionIcon
            onClick={() => navigation.edit("patient", row.original.id)}
            size={"sm"}
          >
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Открыть">
          <ActionIcon
            onClick={() => navigation.show("patient", row.original.id)}
            size={"sm"}
          >
            <IconEye />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
  });
  React.useEffect(() => {
    if (typeof window !== "undefined" && patientsByTherapist.data?.data) {
      setData(patientsByTherapist.data.data);
    }
  }, [patientsByTherapist.isSuccess, patientsByTherapist.data?.data]);
  React.useEffect(() => {
    try {
      //scroll to the top of the table when the sorting changes
      rowVirtualizerInstanceRef.current?.scrollToIndex(0);
    } catch (e) {
      console.log(e);
    }
  }, [sorting]);
  return (
    <List>
      <MantineReactTable table={table} />
    </List>
  );
};
