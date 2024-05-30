export enum Roles {
  therapist = "therapist",
  explorer = "explorer",
}

export interface User {
  username: string;
  role: Roles;
  is_superuser: boolean;
  is_active: boolean;
  id: string;
}

export interface Patient {
  birthday?: Date;
  gender?: "м" | "ж";
  full_name?: string;
  living_place?: string;
  job_title?: string;
  inhabited_locality?: "Город" | "Район";
  bp?: boolean;
  ischemia?: boolean;
  dep?: boolean;
  id: string;
  therapist_id?: string;
}

export interface PatientRecord {
  visit: string;
  diagnosis: string;
  treatment: string;
  patient_id: string;
  id: string;
}

export type FilterConfig = {
  global_rule?: string;
  filters?: Filter[];
  sorting_rules?: SortingRule[];
};

export type Filter = {
  field: string;
  value: string | number | Date | boolean;
  rule: string;
};

export type SortingRule = {
  field: string;
  order: string;
};

export type Statistic = {
  bp: number;
  ischemia: number;
  dep: number;
  male: number;
  female: number;
  city: number;
  district: number;
};

export type PatientsResponse = {
  patients: Patient[];
  statistic: Statistic;
};
