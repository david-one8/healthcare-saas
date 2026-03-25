import { create } from "zustand";
import { getPatients } from "../services/patient.service";
import type { Patient, PatientSortBy, ViewMode } from "../types/patient";

let patientRequestId = 0;

interface PatientState {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  department: string;
  status: string;
  gender: string;
  sortBy: PatientSortBy;
  sortDir: "asc" | "desc";
  viewMode: ViewMode;
  loading: boolean;
  error: string | null;
  setSearch: (value: string) => void;
  setDepartment: (value: string) => void;
  setStatus: (value: string) => void;
  setGender: (value: string) => void;
  setSortBy: (value: PatientSortBy) => void;
  setSortDir: (value: "asc" | "desc") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setViewMode: (mode: ViewMode) => void;
  resetFilters: () => void;
  fetchPatients: () => Promise<void>;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  total: 0,
  page: 1,
  limit: 8,
  totalPages: 1,
  search: "",
  department: "all",
  status: "all",
  gender: "all",
  sortBy: "lastVisit",
  sortDir: "desc",
  viewMode: "grid",
  loading: false,
  error: null,

  setSearch: (search) => set({ search, page: 1 }),
  setDepartment: (department) => set({ department, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setGender: (gender) => set({ gender, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setSortDir: (sortDir) => set({ sortDir, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setViewMode: (viewMode) => set({ viewMode }),

  resetFilters: () =>
    set({
      page: 1,
      search: "",
      department: "all",
      status: "all",
      gender: "all",
      sortBy: "lastVisit",
      sortDir: "desc",
    }),

  fetchPatients: async () => {
    const state = get();
    const requestId = ++patientRequestId;
    set({ loading: true, error: null });

    try {
      const response = await getPatients({
        search: state.search,
        department: state.department,
        status: state.status,
        gender: state.gender,
        sortBy: state.sortBy,
        sortDir: state.sortDir,
        page: state.page,
        limit: state.limit,
      });

      if (requestId !== patientRequestId) return;

      set({
        patients: response.items,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        loading: false,
      });
    } catch (error) {
      if (requestId !== patientRequestId) return;

      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load patients.",
      });
    }
  },
}));
