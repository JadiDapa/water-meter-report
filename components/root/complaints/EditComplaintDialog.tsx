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
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { UpdateComplaintSchema, ComplaintType } from "@/servers/validators/complaint.validator";
import { updateComplaint } from "@/app/actions/complaint.actions";

type ComplaintFormType = z.infer<typeof UpdateComplaintSchema>;

export default function EditComplaintDialog({ complaint }: { complaint: ComplaintType }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ComplaintFormType>({
    resolver: zodResolver(UpdateComplaintSchema),
    defaultValues: {
      location: complaint.location,
      title: complaint.title,
      description: complaint.description,
    },
  });

  function onSubmit(values: ComplaintFormType) {
    startTransition(async () => {
      try {
        await updateComplaint(complaint.id, values);
        toast.success("Keluhan diperbarui");
        setOpen(false);
      } catch {
        toast.error("Gagal memperbarui keluhan");
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
          <DialogTitle>Edit Keluhan</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Perbarui data keluhan
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
                    <InputGroupInput {...field} placeholder="Lokasi" />
                  </InputGroup>
                </Field>
              )}
            />
            <Controller
              name="title"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Judul</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Judul keluhan" />
                  </InputGroup>
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Deskripsi</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Deskripsi keluhan"
                    rows={4}
                  />
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
