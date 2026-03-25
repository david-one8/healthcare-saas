import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { Patient } from "../../types/patient";
import { Badge } from "../ui/badge";
import { formatDate, getInitials } from "../../lib/utils";
import { PatientRow } from "./patient-row";

const ROW_HEIGHT = 88;
const MAX_VIEWPORT_HEIGHT = ROW_HEIGHT * 6;
const OVERSCAN = 4;

function getStatusVariant(status: Patient["status"]) {
  if (status === "Critical") return "destructive";
  if (status === "Inactive") return "warning";
  return "success";
}

function DesktopPatientRow({
  patient,
  style,
}: {
  patient: Patient;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className="grid h-[88px] grid-cols-[2.2fr_1.1fr_1fr_0.8fr_0.9fr] items-center gap-4 border-b px-4 py-3 last:border-b-0"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary font-semibold text-primary">
          {getInitials(patient.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{patient.name}</p>
          <p className="truncate text-sm text-muted-foreground">{patient.email}</p>
        </div>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm">{patient.department}</p>
        <p className="text-xs text-muted-foreground">{patient.city}</p>
      </div>

      <div className="text-sm text-muted-foreground">{formatDate(patient.lastVisit)}</div>
      <div className="text-sm font-medium">{patient.riskScore}</div>
      <div className="flex justify-end">
        <Badge variant={getStatusVariant(patient.status)}>{patient.status}</Badge>
      </div>
    </div>
  );
}

export function PatientVirtualTable({ patients }: { patients: Patient[] }) {
  const [scrollTop, setScrollTop] = useState(0);

  const viewportHeight = Math.min(MAX_VIEWPORT_HEIGHT, Math.max(ROW_HEIGHT, patients.length * ROW_HEIGHT));
  const totalHeight = patients.length * ROW_HEIGHT;

  const { visiblePatients, offsetY } = useMemo(() => {
    const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT);
    const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
    const endIndex = Math.min(
      patients.length,
      startIndex + visibleCount + OVERSCAN * 2
    );

    return {
      visiblePatients: patients.slice(startIndex, endIndex).map((patient, index) => ({
        patient,
        absoluteIndex: startIndex + index,
      })),
      offsetY: startIndex * ROW_HEIGHT,
    };
  }, [patients, scrollTop, viewportHeight]);

  return (
    <>
      <div className="space-y-3 md:hidden">
        {patients.map((patient) => (
          <PatientRow key={patient.id} patient={patient} />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-soft md:block">
        <div className="grid grid-cols-[2.2fr_1.1fr_1fr_0.8fr_0.9fr] gap-4 border-b bg-muted/60 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <span>Patient</span>
          <span>Department</span>
          <span>Last visit</span>
          <span>Risk</span>
          <span className="text-right">Status</span>
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: `${viewportHeight}px` }}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        >
          <div style={{ height: `${totalHeight}px` }}>
            <div style={{ transform: `translateY(${offsetY}px)` }}>
              {visiblePatients.map(({ patient, absoluteIndex }) => (
                <DesktopPatientRow
                  key={patient.id}
                  patient={patient}
                  style={{ willChange: absoluteIndex === 0 ? undefined : "transform" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
