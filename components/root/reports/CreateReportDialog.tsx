"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { CreateReportSchema } from "@/servers/validators/report.validator";
import { createReport } from "@/app/actions/report.actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer } from "@/generated/prisma";

type ReportFormType = z.infer<typeof CreateReportSchema>;

export default function CreateReportDialog({
  technicianId,
  customerId,
  customers,
}: {
  technicianId?: number;
  customerId?: number;
  customers?: Customer[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ReportFormType>({
    resolver: zodResolver(CreateReportSchema),
    defaultValues: {
      technicianId: technicianId ? technicianId : undefined,
      customerId: customerId ? customerId : undefined,
      location: "",
      values: "",
    },
  });

  async function onSubmit(values: ReportFormType) {
    startTransition(async () => {
      try {
        await createReport(values);
        toast.success("Report created!");
        setOpen(false);
        form.reset();
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex cursor-pointer items-center gap-2 px-6">
          <p className="text-lg font-semibold">Tambah Report</p>
          <Plus className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Report</DialogTitle>
          <p className="text-muted-foreground text-sm">Masukkan data laporan</p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            {customers && (
              <Controller
                name="customerId"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Customer</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={"Pilih Customer..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((b) => (
                          <SelectItem key={b.id} value={b.id.toString()}>
                            {b.fullname} - {b.customerId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            )}
            {/* Location */}
            <Controller
              name="location"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Location</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      placeholder="Lokasi pekerjaan"
                    />
                  </InputGroup>
                </Field>
              )}
            />

            {/* Values */}
            <Controller
              name="values"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Values</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      placeholder="Isi Nilai Meteran..."
                      type="number"
                    />
                    <InputGroupAddon align={"inline-end"}> m³</InputGroupAddon>
                  </InputGroup>
                </Field>
              )}
            />

            {/* Optional Images */}
            {/* 
            <Field>
              <FieldLabel>Images</FieldLabel>
              <Input type="file" multiple />
            </Field> 
            */}

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>

              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? <Spinner /> : "Tambahkan"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
