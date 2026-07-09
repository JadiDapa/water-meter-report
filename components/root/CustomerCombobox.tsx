"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface CustomerComboboxItem {
  id: number;
  fullname: string;
  customerId: string;
}

interface CustomerComboboxProps<T extends CustomerComboboxItem> {
  customers: T[];
  value?: number;
  onChange: (customer: T | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CustomerCombobox<T extends CustomerComboboxItem>({
  customers,
  value,
  onChange,
  placeholder = "Pilih Pelanggan...",
  disabled,
  className,
}: CustomerComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = useMemo(
    () => customers.find((c) => c.id === Number(value)),
    [customers, value],
  );

  // Nothing shows until the user types — filter by nama pelanggan or ID.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return customers.filter(
      (c) =>
        c.fullname.toLowerCase().includes(q) ||
        c.customerId.toLowerCase().includes(q),
    );
  }, [customers, search]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {selected
              ? `${selected.fullname} - ${selected.customerId}`
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Cari nama atau ID pelanggan..."
          />
          <CommandList>
            {search.trim() === "" ? (
              <CommandEmpty>Ketik untuk mencari pelanggan.</CommandEmpty>
            ) : filtered.length === 0 ? (
              <CommandEmpty>Pelanggan tidak ditemukan.</CommandEmpty>
            ) : (
              filtered.map((c) => (
                <CommandItem
                  key={c.id}
                  value={`${c.fullname} ${c.customerId}`}
                  onSelect={() => {
                    onChange(c);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={cn(
                      "size-4",
                      selected?.id === c.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="truncate">
                    {c.fullname} - {c.customerId}
                  </span>
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
