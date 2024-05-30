import { Button, Group, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { PatientRecord } from "../../types";

const RecordForm = ({
  handleSubmit,
  initialValues,
}: {
  handleSubmit: any;
  initialValues?: PatientRecord;
}) => {
  const form = useForm({
    mode: "uncontrolled",

    initialValues: initialValues
      ? {
          ...initialValues,
          visit: Date.parse(initialValues.visit)
            ? new Date(initialValues.visit)
            : new Date(),
        }
      : undefined,
  });
  return (
    <form
      onSubmit={form.onSubmit((val) => {
        handleSubmit(val);
      })}
    >
      <DateInput
        valueFormat="DD MM YYYY"
        label="Дата"
        placeholder="Выберите дату"
        clearable
        {...form.getInputProps("visit")}
        key={form.key("visit")}
      />
      <Textarea
        label="Диагноз"
        placeholder="Введите диагноз"
        {...form.getInputProps("diagnosis")}
        key={form.key("diagnosis")}
      />
      <Textarea
        label="Лечение"
        placeholder="Введите лечение"
        {...form.getInputProps("treatment")}
        key={form.key("treatment")}
      />
      <Group justify="flex-start" mt="md">
        <Button type="submit" w={"100%"}>
          {initialValues ? "Сохранить" : "Добавить"}
        </Button>
      </Group>
    </form>
  );
};

export default RecordForm;
