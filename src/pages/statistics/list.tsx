import { Box, Button, List, Text, Group } from "@mantine/core";
import { useCreate } from "@refinedev/core";
import { Patient } from "../../types";
import { IconDownload } from "@tabler/icons-react";
import {
  MRT_ColumnDef,
  MRT_RowVirtualizer,
  MRT_SortingState,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import React from "react";
import { BarChart, LineChart, PieChart } from "@mantine/charts";

// @ts-ignore
import { mkConfig, generateCsv, download } from "export-to-csv"; //or use your library of choice here

const csvConfig = mkConfig({
  useKeysAsHeaders: true,
  filename: 'статистика пациентов'
});

function getFullYear(birthDate: Date | string) {
  const today = new Date();
  const birth = new Date(birthDate);

  if (isNaN(birth.getTime())) {
    return null;
  }

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

const Statistics = () => {
  const allPatients = useCreate();
  const rowVirtualizerInstanceRef = React.useRef<MRT_RowVirtualizer>(null);
  const [data, setData] = React.useState<Patient[]>([]);
  const [sorting, setSorting] = React.useState<MRT_SortingState>([]);
  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(
      table.getFilteredRowModel().rows.map((e) => {
        return {
          "День рождения": e.original.birthday,
          Пол: e.original.gender,
          "Населенный пункт": e.original.inhabited_locality,
          БП: e.original.bp,
          Ишемия: e.original.ischemia,
          ДЭП: e.original.dep,
        };
      }) as any
    );
    download(csvConfig)(csv);
  };
  const columns = React.useMemo<MRT_ColumnDef<Patient>[]>(
    () => [
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
    mantineTableContainerProps: { style: { maxHeight: "600px" } },
    onSortingChange: setSorting,
    state: { isLoading: allPatients.isLoading, sorting },
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
          onClick={handleExportData}
          rightSection={<IconDownload />}
          variant="filled"
        >
          Экспорт
        </Button>
      </Box>
    ),
  });
  React.useEffect(() => {
    async function getAll() {
      try {
        const data = await allPatients.mutateAsync({
          resource: "patient/get_all?limit=10000",
          values: {},
        });
        setData(data.data.patients ?? []);
      } catch (error) {
        console.log(error);
      }
    }
    getAll();
  }, []);
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
      <Text fz="xs" mb="sm" ta="center">
        Всего: {data.length}
      </Text>
      <Text fz="xs" mb="sm" ta="center">
        Найдено: {table.getFilteredRowModel().rows.length}
      </Text>
      <Group gap={50} mb={10} display={"flex"}>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Болезнь
          </Text>
          <PieChart
            withTooltip
            tooltipDataSource="segment"
            withLabelsLine
            labelsPosition="outside"
            labelsType="value"
            withLabels
            data={[
              {
                name: "БП",
                value: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.bp).length,
                color: "indigo.6",
              },
              {
                name: "ДЭП",
                value: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.dep).length,
                color: "yellow.6",
              },
              {
                name: "Ишемия",
                value: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.ischemia).length,
                color: "teal.6",
              },
            ]}
          />
        </div>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Пол
          </Text>
          <PieChart
            w={300}
            withTooltip
            tooltipDataSource="segment"
            withLabelsLine
            labelsPosition="outside"
            labelsType="value"
            withLabels
            data={[
              {
                name: "Мужской",
                value: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.gender === "м" || e.gender === "М").length,
                color: "indigo.6",
              },
              {
                name: "Женский",
                value: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.gender === "ж" || e.gender === "Ж").length,
                color: "yellow.6",
              },
            ]}
          />
        </div>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Населенный пункт
          </Text>
          <PieChart
            w={300}
            withTooltip
            tooltipDataSource="segment"
            withLabelsLine
            labelsPosition="outside"
            labelsType="value"
            withLabels
            data={[
              {
                name: "Город",
                value: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.inhabited_locality === "Город").length,
                color: "indigo.6",
              },
              {
                name: "Район",
                value: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.inhabited_locality !== "Город").length,
                color: "yellow.6",
              },
            ]}
          />
        </div>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Болезнь по полу
          </Text>
          <BarChart
            w={300}
            h={300}
            data={[
              {
                gender: "М",
                БП: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.bp && (e.gender === "м" || e.gender === "М"))
                  .length,
                Ишемия: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter(
                    (e) => e.ischemia && (e.gender === "м" || e.gender === "М")
                  ).length,
                ДЭП: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter(
                    (e) => e.dep && (e.gender === "м" || e.gender === "М")
                  ).length,
              },
              {
                gender: "Ж",
                БП: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.bp && (e.gender === "ж" || e.gender === "Ж"))
                  .length,
                Ишемия: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter(
                    (e) => e.ischemia && (e.gender === "ж" || e.gender === "Ж")
                  ).length,
                ДЭП: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter(
                    (e) => e.dep && (e.gender === "ж" || e.gender === "Ж")
                  ).length,
              },
            ]}
            dataKey="gender"
            type="stacked"
            series={[
              { name: "БП", color: "violet.6" },
              { name: "Ишемия", color: "blue.6" },
              { name: "ДЭП", color: "teal.6" },
            ]}
          />
        </div>
        <div>
          <Text fz="xs" mb="sm" ta="center">
             Болезнь по населенному пункту
          </Text>
          <BarChart
            w={300}
            h={300}
            data={[
              {
                inhabited_locality: "Город",
                БП: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.bp && e.inhabited_locality === "Город")
                  .length,
                Ишемия: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.ischemia && e.inhabited_locality === "Город")
                  .length,
                ДЭП: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.dep && e.inhabited_locality === "Город")
                  .length,
              },
              {
                inhabited_locality: "Район",
                БП: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.bp && e.inhabited_locality !== "Город")
                  .length,
                Ишемия: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.ischemia && e.inhabited_locality !== "Город")
                  .length,
                ДЭП: table
                  .getFilteredRowModel()
                  .rows.map((e) => e.original)
                  .filter((e) => e.dep && e.inhabited_locality !== "Город")
                  .length,
              },
            ]}
            dataKey="inhabited_locality"
            type="stacked"
            series={[
              { name: "БП", color: "violet.6" },
              { name: "Ишемия", color: "blue.6" },
              { name: "ДЭП", color: "teal.6" },
            ]}
          />
        </div>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Болезнь по возрастам
          </Text>
          <LineChart
            w={1000}
            h={300}
            data={Array.from(
              new Set(data.map((e) => getFullYear(e.birthday || "")))
            )
              .filter((age): age is number => age !== null)
              .sort((a, b) => a - b)
              .map((age) => {
                return {
                  age,
                  БП: table
                    .getFilteredRowModel()
                    .rows.map((e) => e.original)
                    .filter(
                      (e) => getFullYear(e.birthday || "") === age && e.bp
                    ).length,
                  ДЭП: table
                    .getFilteredRowModel()
                    .rows.map((e) => e.original)
                    .filter(
                      (e) => getFullYear(e.birthday || "") === age && e.dep
                    ).length,
                  Ишемия: table
                    .getFilteredRowModel()
                    .rows.map((e) => e.original)
                    .filter(
                      (e) => getFullYear(e.birthday || "") === age && e.ischemia
                    ).length,
                };
              })}
            dataKey="age"
            series={[
              { name: "БП", color: "indigo.6" },
              { name: "ДЭП", color: "blue.6" },
              { name: "Ишемия", color: "teal.6" },
            ]}
            curveType="linear"
            tickLine="xy"
          />
        </div>
      </Group>
      <MantineReactTable table={table} />
    </List>
  );
};

export default Statistics;
