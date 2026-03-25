import { lazy, Suspense, useMemo } from "react";
import { Activity, AlertTriangle, HeartPulse } from "lucide-react";
import { PageHeader } from "../components/common/page-header";
import { StatCard } from "../components/common/stat-card";
import { AnalyticsChartsLoading } from "../components/analytics/analytics-charts-loading";
import { patientsMock } from "../mock/patients";

const AnalyticsCharts = lazy(() => import("../components/analytics/analytics-charts"));

export default function AnalyticsPage() {
  const departmentData = useMemo(() => {
    const map = patientsMock.reduce<Record<string, number>>((acc, patient) => {
      acc[patient.department] = (acc[patient.department] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(map).map(([name, patients]) => ({ name, patients }));
  }, []);

  const statusData = useMemo(() => {
    const statuses = ["Active", "Inactive", "Critical"] as const;
    return statuses.map((status) => ({
      name: status,
      value: patientsMock.filter((patient) => patient.status === status).length,
    }));
  }, []);

  const visitsTrend = useMemo(() => {
    const map = new Map<string, number>();

    patientsMock.forEach((patient) => {
      const date = new Date(patient.lastVisit);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, visits]) => {
        const [year, month] = key.split("-").map(Number);
        return {
          month: new Date(year, month).toLocaleDateString(undefined, { month: "short" }),
          visits,
        };
      });
  }, []);

  const critical = patientsMock.filter((patient) => patient.status === "Critical").length;
  const averageAppointments = Math.round(
    patientsMock.reduce((sum, patient) => sum + patient.appointments, 0) / patientsMock.length
  );
  const averageRisk = Math.round(
    patientsMock.reduce((sum, patient) => sum + patient.riskScore, 0) / patientsMock.length
  );

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Track patient volume, operational health, and care risk indicators."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Avg appointments"
          value={`${averageAppointments}`}
          subtitle="Per patient profile"
          icon={Activity}
        />
        <StatCard
          title="Critical patients"
          value={`${critical}`}
          subtitle="Escalated care cases"
          icon={AlertTriangle}
        />
        <StatCard
          title="Average risk score"
          value={`${averageRisk}`}
          subtitle="Portfolio-wide measure"
          icon={HeartPulse}
        />
      </div>

      <Suspense fallback={<AnalyticsChartsLoading />}>
        <AnalyticsCharts
          departmentData={departmentData}
          statusData={statusData}
          visitsTrend={visitsTrend}
        />
      </Suspense>
    </div>
  );
}
