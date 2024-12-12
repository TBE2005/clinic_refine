import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  InputLabel,
  Select,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Patient } from "../../types";

const PatientForm = ({
  handleSubmit,
  initialValues,
}: {
  handleSubmit: (values: any) => void;
  initialValues?: any;
}) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: initialValues
      ? {
          ...initialValues,
          birthday: Date.parse(initialValues?.birthday)
            ? new Date(
                new Date(initialValues?.birthday).setUTCHours(0, 0, 0, 0)
              )
            : new Date(new Date().setUTCHours(0, 0, 0, 0)),
        }
      : undefined,
    validate: {
      gender: (value) => (!value ? "Пол обязательно" : null),
      full_name: (value) =>
        !/^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+$/u.test(value)
          ? `Формат фио - "Имя Отчество Фамилия"`
          : null,
    },
  });
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
      })}
    >
      <TextInput
        label="ФИО"
        placeholder="Введите фио"
        key={form.key("full_name")}
        {...form.getInputProps("full_name")}
      />
      <TextInput
        label="Место жительства"
        placeholder="Введите место жительства"
        key={form.key("living_place")}
        {...form.getInputProps("living_place")}
      />
      <TextInput
        label="Должность"
        placeholder="Введите должность"
        key={form.key("job_title")}
        {...form.getInputProps("job_title")}
      />
      <DatePickerInput
        valueFormat="DD MM YYYY"
        key={form.key("birthday")}
        {...form.getInputProps("birthday")}
        label="Дата рождения"
        placeholder="Выберите / введите дату рождения"
        clearable
      />
      <Select
        label="Пол"
        placeholder="Пол"
        key={form.key("gender")}
        {...form.getInputProps("gender")}
        data={[
          {
            label: "Мужской",
            value: "м",
          },
          {
            label: "Женский",
            value: "ж",
          },
        ]}
      />

      <Select
        label="Населенный пункт"
        placeholder="Населенный пункт"
        key={form.key("inhabited_locality")}
        {...form.getInputProps("inhabited_locality")}
        data={[
          {
            label: "Город",
            value: "Город",
          },
          {
            label: "Район",
            value: "Район",
          },
        ]}
      />
      <Box>
        <InputLabel>Болезни</InputLabel>
        <Flex gap={"md"}>
          <Checkbox
            label="БП"
            checked={form.getValues().bp}
            onChange={(event) =>
              form.setFieldValue("bp", event.currentTarget.checked)
            }
          />
          <Checkbox
            label="Ишемия"
            checked={form.getValues().ischemia}
            onChange={(event) =>
              form.setFieldValue("ischemia", event.currentTarget.checked)
            }
          />
          <Checkbox
            label="ДЭП"
            checked={form.getValues().dep}
            onChange={(event) =>
              form.setFieldValue("dep", event.currentTarget.checked)
            }
          />
        </Flex>
      </Box>

      <Button mt="sm" type="submit" w={"100%"}>
        {initialValues ? "Сохранить" : "Добавить"}
      </Button>
    </form>
  );
};

export default PatientForm;
