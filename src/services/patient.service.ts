import { patientsMock } from "../mock/patients";
import type { Patient, PatientQueryParams, PatientResponse } from "../types/patient";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPatients(params: PatientQueryParams): Promise<PatientResponse> {
  await delay(500);

  if (params.search.toLowerCase() === "error") {
    throw new Error("Simulated API error. Use any other search value.");
  }

  let data: Patient[] = [...patientsMock];

  const search = params.search.trim().toLowerCase();

  if (search) {
    data = data.filter((patient) =>
      [patient.name, patient.email, patient.city, patient.condition]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }

  if (params.department !== "all") {
    data = data.filter((patient) => patient.department === params.department);
  }

  if (params.status !== "all") {
    data = data.filter((patient) => patient.status === params.status);
  }

  if (params.gender !== "all") {
    data = data.filter((patient) => patient.gender === params.gender);
  }

  data.sort((a, b) => {
    const direction = params.sortDir === "asc" ? 1 : -1;

    if (params.sortBy === "lastVisit") {
      return (new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime()) * direction;
    }

    if (params.sortBy === "name") {
      return a.name.localeCompare(b.name) * direction;
    }

    return ((a[params.sortBy] as number) - (b[params.sortBy] as number)) * direction;
  });

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / params.limit));
  const safePage = Math.min(params.page, totalPages);
  const start = (safePage - 1) * params.limit;
  const items = data.slice(start, start + params.limit);

  return {
    items,
    total,
    page: safePage,
    limit: params.limit,
    totalPages,
  };
}
