import { useEffect, useState } from "react";
import { BellRing, HeartPulse, Radio, ShieldAlert, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "../components/common/page-header";
import { StatCard } from "../components/common/stat-card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { patientsMock } from "../mock/patients";
import { formatDate } from "../lib/utils";
import {
  getNotificationStatus,
  showAppNotification,
  showToastNotification,
  subscribeToPushNotifications,
  triggerDemoPushNotification,
  unsubscribeFromPushNotifications,
  type NotificationStatus,
} from "../services/notifications";

const defaultNotificationStatus: NotificationStatus = {
  supported: false,
  pushSupported: false,
  permission: "default",
  subscribed: false,
  pushConfigured: false,
};

export default function DashboardPage() {
  const [notificationStatus, setNotificationStatus] =
    useState<NotificationStatus>(defaultNotificationStatus);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const totalPatients = patientsMock.length;
  const criticalPatients = patientsMock.filter((p) => p.status === "Critical").length;
  const activePatients = patientsMock.filter((p) => p.status === "Active").length;
  const avgRisk = Math.round(
    patientsMock.reduce((sum, patient) => sum + patient.riskScore, 0) / totalPatients
  );

  const recentPatients = [...patientsMock]
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
    .slice(0, 5);

  const departmentMap = patientsMock.reduce<Record<string, number>>((acc, patient) => {
    acc[patient.department] = (acc[patient.department] || 0) + 1;
    return acc;
  }, {});

  const criticalList = patientsMock.filter((patient) => patient.status === "Critical").slice(0, 4);

  const syncNotificationStatus = async () => {
    const status = await getNotificationStatus();
    setNotificationStatus(status);
  };

  useEffect(() => {
    void syncNotificationStatus();
  }, []);

  const handlePushToggle = async () => {
    setNotificationLoading(true);

    try {
      if (notificationStatus.subscribed) {
        await unsubscribeFromPushNotifications();
        showToastNotification(
          "Push notifications disabled",
          "This browser will stop receiving HealthHQ push messages.",
          "info"
        );
      } else {
        await subscribeToPushNotifications();
        showToastNotification(
          "Push notifications enabled",
          "Browser push is configured for HealthHQ updates.",
          "success"
        );
      }

      await syncNotificationStatus();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update push notifications.";
      showToastNotification("Notification setup failed", message, "error");
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleDemoPush = async () => {
    try {
      await triggerDemoPushNotification(
        "Critical patient update",
        "A simulated push alert has arrived for the care operations dashboard."
      );
      showToastNotification(
        "Push-style notification sent",
        "The service worker displayed a simulated incoming push alert.",
        "success"
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to trigger a demo push notification.";
      showToastNotification("Demo push failed", message, "error");
    }
  };

  return (
    <div>
      <PageHeader
        title="Healthcare Operations Dashboard"
        description="Unified overview of care delivery, patient health trends, and operational signals."
        action={
          <Button
            onClick={() =>
              showAppNotification("Daily digest ready", "4 patients need immediate review today.")
            }
          >
            <BellRing className="h-4 w-4" />
            Test local notification
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total patients" value={`${totalPatients}`} subtitle="Current managed records" icon={Users} />
        <StatCard title="Active cases" value={`${activePatients}`} subtitle="Patients under active care" icon={HeartPulse} />
        <StatCard title="Critical alerts" value={`${criticalPatients}`} subtitle="Requires immediate attention" icon={ShieldAlert} />
        <StatCard title="Average risk" value={`${avgRisk}`} subtitle="Risk score across records" icon={TrendingUp} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent patient activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {patient.department} | {patient.condition}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      patient.status === "Critical"
                        ? "destructive"
                        : patient.status === "Inactive"
                        ? "warning"
                        : "success"
                    }
                  >
                    {patient.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{formatDate(patient.lastVisit)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">Push subscription</p>
                    <p className="text-sm text-muted-foreground">
                      {notificationStatus.subscribed
                        ? "This browser is subscribed for HealthHQ push delivery."
                        : "Enable browser push subscription for critical care alerts."}
                    </p>
                  </div>
                  <Badge variant={notificationStatus.subscribed ? "success" : "outline"}>
                    {notificationStatus.subscribed ? "Subscribed" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Permission: <span className="font-medium text-foreground">{notificationStatus.permission}</span></p>
                <p>Push support: <span className="font-medium text-foreground">{notificationStatus.pushSupported ? "Available" : "Unavailable"}</span></p>
                <p>VAPID configured: <span className="font-medium text-foreground">{notificationStatus.pushConfigured ? "Yes" : "No"}</span></p>
              </div>

              <div className="grid gap-3">
                <Button
                  variant="outline"
                  onClick={handlePushToggle}
                  disabled={
                    notificationLoading ||
                    !notificationStatus.pushSupported ||
                    !notificationStatus.pushConfigured
                  }
                >
                  <Radio className="h-4 w-4" />
                  {notificationLoading
                    ? "Updating push settings..."
                    : notificationStatus.subscribed
                    ? "Disable push notifications"
                    : "Enable push notifications"}
                </Button>

                <Button onClick={handleDemoPush} disabled={!notificationStatus.supported}>
                  <BellRing className="h-4 w-4" />
                  Trigger push-style demo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(departmentMap).map(([department, count]) => {
                const width = Math.round((count / totalPatients) * 100);
                return (
                  <div key={department}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>{department}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>High priority queue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalList.map((patient) => (
                <div key={patient.id} className="rounded-2xl border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{patient.name}</p>
                    <Badge variant="destructive">Risk {patient.riskScore}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {patient.department} | {patient.condition}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
