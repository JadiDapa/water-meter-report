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
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { UpdateTechnicianSchema, TechnicianType } from "@/servers/validators/technician.validator";
import { updateTechnician } from "@/app/actions/technician.action";

type TechnicianFormType = z.infer<typeof UpdateTechnicianSchema>;

export default function EditTechnicianDialog({ technician }: { technician: TechnicianType }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<TechnicianFormType>({
    resolver: zodResolver(UpdateTechnicianSchema),
    defaultValues: {
      fullname: technician.fullname,
      phoneNumber: technician.phoneNumber,
      region: technician.region,
    },
  });

  function onSubmit(values: TechnicianFormType) {
    startTransition(async () => {
      try {
        await updateTechnician(technician.id, values);
        toast.success("Teknisi diperbarui");
        setOpen(false);
      } catch {
        toast.error("Gagal memperbarui teknisi");
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
          <DialogTitle>Edit Teknisi</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Perbarui data teknisi
          </p>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <Controller
              name="fullname"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Nama</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Nama lengkap" />
                  </InputGroup>
                </Field>
              )}
            />
            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Nomor Telepon</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Nomor Telepon" />
                  </InputGroup>
                </Field>
              )}
            />
            <Controller
              name="region"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Wilayah</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Wilayah kerja" />
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
