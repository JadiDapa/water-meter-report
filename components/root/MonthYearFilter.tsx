"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS_ID } from "@/lib/format";

interface MonthYearFilterProps {
  /** Selected month, 1–12. */
  month: number;
  /** Selected year. */
  year: number;
  /** Years to offer in the year dropdown (descending). */
  years: number[];
}

/**
 * Month/year picker that writes its selection to the `month`/`year` URL
 * search params, scoping the page to a single month. Defaults are resolved
 * server-side via `parseMonthYear`, so the page always reflects a valid month.
 */
export default function MonthYearFilter({
  month,
  year,
  years,
}: MonthYearFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (key: "month" | "year", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={String(month)} onValueChange={(v) => update("month", v)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Bulan" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS_ID.map((name, i) => (
            <SelectItem key={name} value={String(i + 1)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={String(year)} onValueChange={(v) => update("year", v)}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Tahun" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
