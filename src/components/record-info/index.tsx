import React from "react";
import { PatientRecord } from "../../types";
import { List } from "@mantine/core";

type Props = {
  record: PatientRecord;
};

const RecordInfo = ({ record }: Props) => {
  return (
    <List>
      <List.Item> Дата посещения: {record.visit || "-"}</List.Item>
      <List.Item> Лечение: {record.treatment || "-"}</List.Item>
      <List.Item>Диагноз: {record.diagnosis || "-"}</List.Item>
    </List>
  );
};

export default RecordInfo;
