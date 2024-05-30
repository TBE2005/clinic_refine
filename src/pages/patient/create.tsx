import { useCreate } from "@refinedev/core";
import PatientForm from "../../components/patient-form";
import { Patient } from "../../types";

export const PatientCreate = () => {
  const patient = useCreate();
  return (
    <PatientForm
      handleSubmit={(values: Patient) =>
        patient.mutate({
          resource: "patient/create",
          values,
        })
      }
    />
  );
};
