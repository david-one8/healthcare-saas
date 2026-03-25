import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function PaginationControls({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationControlsProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        Showing page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages}</span> •{" "}
        <span className="font-medium text-foreground">{total}</span> results
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="h-10 rounded-xl border bg-background px-3 text-sm"
        >
          <option value={4}>4 / page</option>
          <option value={8}>8 / page</option>
          <option value={12}>12 / page</option>
        </select>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button
            variant="outline"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}