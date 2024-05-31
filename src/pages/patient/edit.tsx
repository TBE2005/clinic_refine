import { useParams } from "react-router-dom";
import api from "../../axios";
import React from "react";
import PatientForm from "../../components/patient-form";
import RecordForm from "../../components/record-form";
import { Button, Flex, Stack } from "@mantine/core";
import { get, getRecords } from "./show";
import { useCreate, useList } from "@refinedev/core";
import { PatientRecord } from "../../types";

const updatePatiet = async (patient_id: string, data: any) => {
  return await api.patch("patient/update", data, {
    params: {
      patient_id,
    },
  });
};
const deletePatient = async (patient_id: string) => {
  return await api.delete("patient/delete", {
    params: {
      patient_id,
    },
  });
};
const deleteRecord = async (patient_record_id: string) => {
  return await api.delete("patient_records/delete", {
    params: {
      patient_record_id,
    },
  });
};
const updateRecord = async (patient_record_id: string, data: any) => {
  return await api.patch("patient_records/update_patient_record", data, {
    params: {
      patient_record_id,
    },
  });
};

export const PatientEdit = () => {
  const [patient, setPatient] = React.useState(null);
  const params = useParams();
  const record = useCreate();
  const records = useList<PatientRecord>({
    resource:
      "patient_records/get_all_by_patient?" +
      new URLSearchParams({
        patient_id: params.id ?? "",
      }),
    pagination: {
      mode: "off",
    },
  });

  React.useEffect(() => {
    get(params.id ?? "").then((res) => {
      setPatient(res.data);
    });
  }, []);
  return (
    <Flex gap={"xs"}>
      <Stack>
        {patient && (
          <PatientForm
            initialValues={patient}
            handleSubmit={(values) => updatePatiet(params.id ?? "", values)}
          />
        )}
        <Button color="red" onClick={() => deletePatient(params.id ?? "")}>
          Удалить пациента
        </Button>
        <RecordForm
          handleSubmit={(values: PatientRecord) => {
            record
              .mutateAsync({
                resource: "patient_records/create",
                values: {
                  ...values,
                  patient_id: params.id,
                },
              })
              .then(() => {
                records.refetch();
              });
          }}
        />
      </Stack>
      <Stack w={"100%"}>
        {records.data?.data.map((record) => (
          <>
            <RecordForm
              initialValues={record}
              handleSubmit={(data : PatientRecord) => {
                updateRecord(record.id, data).then(() => {
                  records.refetch();
                });
              }}
            />
            <Button
              color="red"
              onClick={() => {
                deleteRecord(record.id).then(() => {
                  records.refetch();
                });
              }}
            >
              Удалить
            </Button>
          </>
        ))}
      </Stack>
    </Flex>
  );
};
