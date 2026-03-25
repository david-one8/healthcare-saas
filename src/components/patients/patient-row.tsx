import { memo } from "react";
import type { Patient } from "../../types/patient";
import { Badge } from "../ui/badge";
import { formatDate, getInitials } from "../../lib/utils";

function getStatusVariant(status: Patient["status"]) {
  if (status === "Critical") return "destructive";
  if (status === "Inactive") return "warning";
  return "success";
}

function PatientRowComponent({ patient }: { patient: Patient }) {
  return (
    <div className="grid gap-4 rounded-2xl border bg-card p-4 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] md:items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary font-semibold text-primary">
          {getInitials(patient.name)}
        </div>
        <div>
          <p className="font-medium">{patient.name}</p>
          <p className="text-sm text-muted-foreground">{patient.email}</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground md:hidden">Department</p>
        <p className="text-sm">{patient.department}</p>
      </div>

      <div>
        <p className="text-xs text-muted-foreground md:hidden">Last Visit</p>
        <p className="text-sm">{formatDate(patient.lastVisit)}</p>
      </div>

      <div>
        <p className="text-xs text-muted-foreground md:hidden">Risk</p>
        <p className="text-sm font-medium">{patient.riskScore}</p>
      </div>

      <div className="flex items-center justify-between gap-2 md:justify-end">
        <div className="md:hidden text-xs text-muted-foreground">Status</div>
        <Badge variant={getStatusVariant(patient.status)}>{patient.status}</Badge>
      </div>
    </div>
  );
}

export const PatientRow = memo(PatientRowComponent);