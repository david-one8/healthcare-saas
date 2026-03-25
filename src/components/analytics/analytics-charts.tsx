import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const COLORS = ["#2563eb", "#06b6d4", "#22c55e", "#f97316", "#8b5cf6", "#ef4444"];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border bg-card/95 px-4 py-3 shadow-soft backdrop-blur">
      {label && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
      )}
      <div className="space-y-2">
        {payload.map((entry) => (
          <div
            key={`${entry.name}-${entry.value}`}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color ?? "#2563eb" }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
            </div>
            <span className="font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DepartmentDatum {
  name: string;
  patients: number;
}

interface StatusDatum {
  name: string;
  value: number;
}

interface VisitsDatum {
  month: string;
  visits: number;
}

interface AnalyticsChartsProps {
  departmentData: DepartmentDatum[];
  statusData: StatusDatum[];
  visitsTrend: VisitsDatum[];
}

export default function AnalyticsCharts({
  departmentData,
  statusData,
  visitsTrend,
}: AnalyticsChartsProps) {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Patients by department</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData}>
              <defs>
                <linearGradient id="patientsBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.25)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "currentColor" }}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={55}
              />
              <YAxis tick={{ fill: "currentColor" }} />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "rgba(37, 99, 235, 0.06)" }}
              />
              <Bar dataKey="patients" radius={[10, 10, 0, 0]} fill="url(#patientsBar)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visit trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitsTrend}>
              <defs>
                <linearGradient id="visitsArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.25)"
                vertical={false}
              />
              <XAxis dataKey="month" tick={{ fill: "currentColor" }} />
              <YAxis tick={{ fill: "currentColor" }} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#06b6d4"
                strokeWidth={3}
                fill="url(#visitsArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Status distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={72}
                outerRadius={120}
                paddingAngle={4}
                labelLine={false}
                label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" iconType="circle" />
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
