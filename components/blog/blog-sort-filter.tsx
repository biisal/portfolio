"use client";

import { Button } from "@/components/ui/button";

export type SortOption = "latest" | "popular" | "oldest";

interface BlogSortFilterProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function BlogSortFilter({
  currentSort,
  onSortChange,
}: BlogSortFilterProps) {
  const options = [
    { value: "latest", label: "Latest" },
    { value: "popular", label: "Popular" },
    { value: "oldest", label: "Oldest" },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {options.map((option) => {
        const isSelected = option.value === currentSort;
        return (
          <Button
            key={option.value}
            variant="chip"
            selected={isSelected}
            onClick={() => onSortChange(option.value)}
            className="h-auto cursor-pointer select-none px-4 py-1.5"
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
