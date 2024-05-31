import { List } from "@mantine/core";
import { Patient } from "../../types";

type Props = {
  patient: any;
};

const PatientInfo = ({ patient }: Props) => {
  return (
    <List>
      <List.Item> ФИО: {patient.full_name || "-"}</List.Item>
      <List.Item> Место жительства: {patient.living_place || "-"}</List.Item>
      <List.Item>Должность: {patient.job_title || "-"}</List.Item>
      <List.Item>
        Населенный пункт: {patient.inhabited_locality || "-"}
      </List.Item>
      <List.Item>Дата рождения: {patient.birthday}</List.Item>
      <List.Item>Пол: {patient.gender}</List.Item>
      <List.Item>Бп: {patient.bp ? "Да" : "Нет"}</List.Item>
      <List.Item>Ишемия: {patient.ischemia ? "Да" : "Нет"}</List.Item>
      <List.Item>Дэп: {patient.dep ? "Да" : "Нет"}</List.Item>
    </List>
  );
};

export default PatientInfo;
