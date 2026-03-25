import { SearchX } from "lucide-react";
import { Button } from "../ui/button";

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border bg-card p-8 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No patients found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try changing your search, filters, or sorting options.
      </p>
      <Button variant="outline" className="mt-4" onClick={onReset}>
        Reset filters
      </Button>
    </div>
  );
}