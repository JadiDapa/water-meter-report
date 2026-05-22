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
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { UpdateReportSchema, ReportType } from "@/servers/validators/report.validator";
import { updateReport } from "@/app/actions/report.actions";

type ReportFormType = z.infer<typeof UpdateReportSchema>;

export default function EditReportDialog({ report }: { report: ReportType }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ReportFormType>({
    resolver: zodResolver(UpdateReportSchema),
    defaultValues: {
      location: report.location,
      values: report.values,
    },
  });

  function onSubmit(values: ReportFormType) {
    startTransition(async () => {
      try {
        await updateReport(report.id, values);
        toast.success("Laporan diperbarui");
        setOpen(false);
      } catch {
        toast.error("Gagal memperbarui laporan");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Laporan</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Perbarui data laporan
          </p>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <Controller
              name="location"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Lokasi</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Lokasi pekerjaan" />
                  </InputGroup>
                </Field>
              )}
            />
            <Controller
              name="values"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Nilai Meteran</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      placeholder="Nilai meteran"
                      type="number"
                    />
                    <InputGroupAddon align="inline-end"> m³</InputGroupAddon>
                  </InputGroup>
                </Field>
              )}
            />
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Spinner /> : "Simpan"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
