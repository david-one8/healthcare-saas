import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { PageHeader } from "../components/common/page-header";
import { LoadingGrid } from "../components/common/loading-grid";
import { ErrorState } from "../components/common/error-state";
import { EmptyState } from "../components/common/empty-state";
import { PaginationControls } from "../components/common/pagination-controls";
import { Button } from "../components/ui/button";
import { PatientCard } from "../components/patients/patient-card";
import { PatientFilters } from "../components/patients/patient-filters";
import { PatientVirtualTable } from "../components/patients/patient-virtual-table";
import { usePatientStore } from "../store/patient-store";
import { useDebounce } from "../hooks/use-debounce";

export default function PatientDetailsPage() {
  const {
    patients,
    total,
    page,
    limit,
    totalPages,
    search,
    department,
    status,
    gender,
    sortBy,
    sortDir,
    viewMode,
    loading,
    error,
    setSearch,
    setDepartment,
    setStatus,
    setGender,
    setSortBy,
    setSortDir,
    setPage,
    setLimit,
    setViewMode,
    resetFilters,
    fetchPatients,
  } = usePatientStore();

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 450);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch !== search) setSearch(debouncedSearch);
  }, [debouncedSearch, search, setSearch]);

  useEffect(() => {
    fetchPatients();
  }, [page, limit, search, department, status, gender, sortBy, sortDir, fetchPatients]);

  const content = useMemo(() => {
    if (loading) return <LoadingGrid count={limit} />;
    if (error) return <ErrorState message={error} onRetry={fetchPatients} />;
    if (!patients.length) return <EmptyState onReset={resetFilters} />;

    if (viewMode === "grid") {
      return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      );
    }

    return <PatientVirtualTable patients={patients} />;
  }, [loading, limit, error, patients, viewMode, fetchPatients, resetFilters]);

  return (
    <div>
      <PageHeader
        title="Patient Details"
        description="Search, filter, sort, and review patient records with responsive grid and list views."
        action={
          <Button variant="outline" onClick={resetFilters}>
            <RotateCcw className="h-4 w-4" />
            Reset filters
          </Button>
        }
      />

      <PatientFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        department={department}
        status={status}
        gender={gender}
        sortBy={sortBy}
        sortDir={sortDir}
        viewMode={viewMode}
        onDepartmentChange={setDepartment}
        onStatusChange={setStatus}
        onGenderChange={setGender}
        onSortByChange={setSortBy}
        onSortDirChange={setSortDir}
        onViewModeChange={setViewMode}
      />

      <div className="my-4 text-sm text-muted-foreground">
        Total patients found: <span className="font-medium text-foreground">{total}</span>
      </div>

      {content}

      {!loading && !error && total > 0 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      )}
    </div>
  );
}
