import { Box, Button, List, Text, Group, Skeleton, LoadingOverlay } from "@mantine/core";
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
import { mkConfig, generateCsv, download } from "export-to-csv";

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
  const [isFiltering, setIsFiltering] = React.useState(false);
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [chartData, setChartData] = React.useState({
    diseaseData: [],
    genderData: [],
    localityData: [],
    diseaseByGenderData: [],
    diseaseByLocalityData: [],
    diseaseByAgeData: [],
  });
  const isLoading = allPatients.isLoading;
  const workerRef = React.useRef<Worker>();

  React.useEffect(() => {
    workerRef.current = new Worker(new URL('../../workers/statistics.worker.ts', import.meta.url));
    workerRef.current.onmessage = (event) => {
      setChartData(event.data);
      setIsCalculating(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const columns = React.useMemo<MRT_ColumnDef<Patient>[]>(
    () => [
      {
        accessorKey: "birthday",
        header: "Дата рождения",
        filterVariant: "date-range",
        Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue() as string).toLocaleDateString('ru-RU') : '',
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
    onSortingChange: (newSorting) => {
      setIsFiltering(true);
      setSorting(newSorting);
      setTimeout(() => setIsFiltering(false), 0);
    },
    state: {
      isLoading: allPatients.isLoading || isFiltering,
      sorting
    },
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 5 },
    columnVirtualizerOptions: { overscan: 2 },
    localization: {
      actions: 'Действия',
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        size: 120, //set custom width for actions column
        minSize: 120,
      },
    },
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

  // Добавляем эффект для обновления графиков при фильтрации
  React.useEffect(() => {
    if (!isFiltering && workerRef.current) {
      setIsCalculating(true);
      const filteredData = table.getFilteredRowModel().rows.map(row => row.original);
      workerRef.current.postMessage({ data: filteredData });
    }
  }, [table.getFilteredRowModel().rows, isFiltering]);

  React.useEffect(() => {
    async function getAll() {
      try {
        const data = await allPatients.mutateAsync({
          resource: "patient/get_all?limit=10000",
          values: {},
        });
        const patients = data.data.patients.map((patient: Patient) => ({
          ...patient,
          birthday: patient.birthday ? new Date(patient.birthday) : undefined
        })) ?? [];
        setData(patients);
        setIsCalculating(true);
        workerRef.current?.postMessage({ data: patients });
      } catch (error) {
        console.log(error);
      }
    }
    getAll();
  }, []);

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(
      table.getFilteredRowModel().rows.map((e) => {
        return {
          "День рождения": e.original.birthday ? new Date(e.original.birthday).toLocaleDateString('ru-RU') : '',
          Пол: e.original.gender,
          "Населенный пункт": e.original.inhabited_locality,
          БП: e.original.bp ? "Да" : "Нет",
          Ишемия: e.original.ischemia ? "Да" : "Нет",
          ДЭП: e.original.dep ? "Да" : "Нет",
        };
      }) as any
    );
    download(csvConfig)(csv);
  };

  return (
    <List>
      <Text fz="xs" mb="sm" ta="center">
        Всего: {isLoading ? <Skeleton height={20} width={50} /> : data.length}
      </Text>
      <Text fz="xs" mb="sm" ta="center">
        Найдено: {isLoading ? <Skeleton height={20} width={50} /> : table.getFilteredRowModel().rows.length}
      </Text>
      <Group gap={50} mb={10} display={"flex"}>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Болезнь
          </Text>
          {isLoading || isCalculating ? (
            <Skeleton height={300} width={300} />
          ) : (
            <PieChart
              withTooltip
              tooltipDataSource="segment"
              withLabelsLine
              labelsPosition="outside"
              labelsType="value"
              withLabels
              data={chartData.diseaseData}
            />
          )}
        </div>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Пол
          </Text>
          {isLoading || isCalculating ? (
            <Skeleton height={300} width={300} />
          ) : (
            <PieChart
              w={300}
              withTooltip
              tooltipDataSource="segment"
              withLabelsLine
              labelsPosition="outside"
              labelsType="value"
              withLabels
              data={chartData.genderData}
            />
          )}
        </div>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Населенный пункт
          </Text>
          {isLoading || isCalculating ? (
            <Skeleton height={300} width={300} />
          ) : (
            <PieChart
              w={300}
              withTooltip
              tooltipDataSource="segment"
              withLabelsLine
              labelsPosition="outside"
              labelsType="value"
              withLabels
              data={chartData.localityData}
            />
          )}
        </div>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Болезнь по полу
          </Text>
          {isLoading || isCalculating ? (
            <Skeleton height={300} width={300} />
          ) : (
            <BarChart
              w={300}
              h={300}
              data={chartData.diseaseByGenderData}
              dataKey="gender"
              type="stacked"
              series={[
                { name: "БП", color: "violet.6" },
                { name: "Ишемия", color: "blue.6" },
                { name: "ДЭП", color: "teal.6" },
              ]}
            />
          )}
        </div>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Болезнь по населенному пункту
          </Text>
          {isLoading || isCalculating ? (
            <Skeleton height={300} width={300} />
          ) : (
            <BarChart
              w={300}
              h={300}
              data={chartData.diseaseByLocalityData}
              dataKey="inhabited_locality"
              type="stacked"
              series={[
                { name: "БП", color: "violet.6" },
                { name: "Ишемия", color: "blue.6" },
                { name: "ДЭП", color: "teal.6" },
              ]}
            />
          )}
        </div>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Болезнь по возрастам
          </Text>
          {isLoading || isCalculating ? (
            <Skeleton height={300} width={1000} />
          ) : (
            <LineChart
              w={1000}
              h={300}
              data={chartData.diseaseByAgeData}
              dataKey="age"
              series={[
                { name: "БП", color: "indigo.6" },
                { name: "ДЭП", color: "blue.6" },
                { name: "Ишемия", color: "teal.6" },
              ]}
              curveType="linear"
              tickLine="xy"
            />
          )}
        </div>
      </Group>
      <Box pos="relative">
        <LoadingOverlay visible={isFiltering} />
        {isLoading ? (
          <Skeleton height={600} />
        ) : (
          <MantineReactTable table={table} />
        )}
      </Box>
    </List>
  );
};

export default Statistics;
