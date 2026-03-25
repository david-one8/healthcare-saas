import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function AnalyticsChartsLoading() {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className={index === 2 ? "xl:col-span-2" : undefined}>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className={index === 2 ? "h-[340px]" : "h-[320px]"}>
            <Skeleton className="h-full w-full rounded-2xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
