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
        const date = new Date(new Date(values.birthday || ""))
          .toLocaleDateString("ru-RU")
          .slice(0, 10);
        const parts = date.split(".");
        try {
          await patient.mutateAsync({
            resource: "patient/create",
            values: {
              ...values,
              birthday: `${parts[2]}-${parts[1]}-${parts[0]}`,
            },
          });
          list("patient");
        } catch (error) {}
      }}
    />
  );
};
