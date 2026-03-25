import { Grid2x2, ListFilter } from "lucide-react";
import { SearchInput } from "../common/search-input";
import { Switch } from "../ui/switch";
import type { PatientSortBy, ViewMode } from "../../types/patient";

interface PatientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  department: string;
  status: string;
  gender: string;
  sortBy: PatientSortBy;
  sortDir: "asc" | "desc";
  viewMode: ViewMode;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onSortByChange: (value: PatientSortBy) => void;
  onSortDirChange: (value: "asc" | "desc") => void;
  onViewModeChange: (value: ViewMode) => void;
}

export function PatientFilters(props: PatientFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-2 xl:grid-cols-6">
      <div className="sm:col-span-2 xl:col-span-2">
        <SearchInput
          value={props.search}
          onChange={props.onSearchChange}
          placeholder="Search by name, email, city, condition..."
        />
      </div>

      <select
        value={props.department}
        onChange={(e) => props.onDepartmentChange(e.target.value)}
        className="h-10 rounded-xl border bg-background px-3 text-sm"
      >
        <option value="all">All departments</option>
        <option value="Cardiology">Cardiology</option>
        <option value="Neurology">Neurology</option>
        <option value="Orthopedics">Orthopedics</option>
        <option value="Dermatology">Dermatology</option>
        <option value="Pediatrics">Pediatrics</option>
        <option value="General Medicine">General Medicine</option>
      </select>

      <select
        value={props.status}
        onChange={(e) => props.onStatusChange(e.target.value)}
        className="h-10 rounded-xl border bg-background px-3 text-sm"
      >
        <option value="all">All status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Critical">Critical</option>
      </select>

      <select
        value={props.gender}
        onChange={(e) => props.onGenderChange(e.target.value)}
        className="h-10 rounded-xl border bg-background px-3 text-sm"
      >
        <option value="all">All genders</option>
        <option value="Female">Female</option>
        <option value="Male">Male</option>
        <option value="Other">Other</option>
      </select>

      <div className="grid grid-cols-2 gap-3 xl:col-span-1">
        <select
          value={props.sortBy}
          onChange={(e) => props.onSortByChange(e.target.value as PatientSortBy)}
          className="h-10 rounded-xl border bg-background px-3 text-sm"
        >
          <option value="lastVisit">Last Visit</option>
          <option value="name">Name</option>
          <option value="age">Age</option>
          <option value="riskScore">Risk</option>
        </select>

        <select
          value={props.sortDir}
          onChange={(e) => props.onSortDirChange(e.target.value as "asc" | "desc")}
          className="h-10 rounded-xl border bg-background px-3 text-sm"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      <div className="flex items-center justify-between rounded-xl border bg-background px-3 py-2 xl:col-span-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ListFilter className="h-4 w-4" />
          View mode
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">List</span>
          <Switch
            checked={props.viewMode === "grid"}
            onCheckedChange={(checked) => props.onViewModeChange(checked ? "grid" : "list")}
          />
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Grid2x2 className="h-4 w-4" />
            Grid
          </span>
        </div>
      </div>
    </div>
  );
}