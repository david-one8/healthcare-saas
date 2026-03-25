export type Gender = "Male" | "Female" | "Other";
export type PatientStatus = "Active" | "Inactive" | "Critical";
export type Department =
  | "Cardiology"
  | "Neurology"
  | "Orthopedics"
  | "Dermatology"
  | "Pediatrics"
  | "General Medicine";

export type ViewMode = "grid" | "list";
export type PatientSortBy = "name" | "age" | "lastVisit" | "riskScore";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  department: Department;
  status: PatientStatus;
  bloodGroup: string;
  lastVisit: string;
  email: string;
  phone: string;
  city: string;
  riskScore: number;
  appointments: number;
  condition: string;
}

export interface PatientQueryParams {
  search: string;
  department: string;
  status: string;
  gender: string;
  sortBy: PatientSortBy;
  sortDir: "asc" | "desc";
  page: number;
  limit: number;
}

export interface PatientResponse {
  items: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}