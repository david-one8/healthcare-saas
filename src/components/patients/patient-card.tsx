import { memo } from "react";
import { CalendarDays, HeartPulse, MapPin } from "lucide-react";
import type { Patient } from "../../types/patient";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { formatDate, getInitials } from "../../lib/utils";

function getStatusVariant(status: Patient["status"]) {
  if (status === "Critical") return "destructive";
  if (status === "Inactive") return "warning";
  return "success";
}

function PatientCardComponent({ patient }: { patient: Patient }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary font-semibold text-primary">
              {getInitials(patient.name)}
            </div>
            <div>
              <h3 className="font-semibold">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">
                {patient.age} yrs • {patient.gender}
              </p>
            </div>
          </div>
          <Badge variant={getStatusVariant(patient.status)}>{patient.status}</Badge>
        </div>

        <div className="rounded-2xl bg-muted p-3">
          <p className="text-sm font-medium">{patient.condition}</p>
          <p className="mt-1 text-xs text-muted-foreground">{patient.department}</p>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Last visit: {formatDate(patient.lastVisit)}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {patient.city}
          </div>
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4" />
            Risk score: <span className="font-medium text-foreground">{patient.riskScore}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const PatientCard = memo(PatientCardComponent);