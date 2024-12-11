import { useCreate } from "@refinedev/core";
import PatientForm from "../../components/patient-form";
import { Patient } from "../../types";
import { useNavigation } from "@refinedev/core";

export const PatientCreate = () => {
  const patient = useCreate();
  const { list } = useNavigation();

  return (
    <PatientForm
      handleSubmit={async (values: Patient) => {
        try {
          await patient.mutateAsync({
            resource: "patient/create",
            values:{
              ...values,
              birthday: new Date(
                new Date(values.birthday || "").setUTCHours(0, 0, 0, 0)
              )
                .toISOString()
                .slice(0, 10),
            },
          });
          list("patient");
        } catch (error) {}
      }}
    />
  );
};
