import { useParams } from "react-router-dom";
import api from "../../axios";
import React from "react";
import PatientInfo from "../../components/patient-info";
import RecordInfo from "../../components/record-info";
import { Button } from "@mantine/core";

export const get = async (patient_id: string) => {
  return await api.get("patient/get", {
    params: {
      patient_id,
    },
  });
};
export const getRecords = async (patient_id: string) => {
  return await api.get("patient_records/get_all_by_patient", {
    params: {
      patient_id,
    },
  });
};
export const PatientShow = () => {
  const params = useParams();
  const [patient, setPatient] = React.useState({});
  const [records, setRecords] = React.useState([]);
  React.useEffect(() => {
    get(String(params.id)).then((res) => {
      setPatient(res.data);
    });
    getRecords(String(params.id)).then((res) => {
      setRecords(res.data);
    });
  }, []);
  return (
    <>
      <PatientInfo patient={patient} />
      <br />

      {records.map((record) => (
        <>
          <RecordInfo record={record} />
          <br />
        </>
      ))}
    </>
  );
};
