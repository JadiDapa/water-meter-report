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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

import { CreateComplaintSchema } from "@/servers/validators/complaint.validator";
import { createComplaint } from "@/app/actions/complaint.actions";

type ComplaintFormType = z.infer<typeof CreateComplaintSchema>;

export default function CreateComplaintDialog({
  technicianId,
  customerId,
}: {
  technicianId: number;
  customerId: number;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ComplaintFormType>({
    resolver: zodResolver(CreateComplaintSchema),
    defaultValues: {
      technicianId: technicianId,
      customerId: customerId,
      location: "",
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: ComplaintFormType) {
    startTransition(async () => {
      try {
        await createComplaint(values);
        toast.success("Complaint created!");
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
        <Button className="cursor-pointer">
          <p className="font-semibold">Tambah Complaint</p>
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Complaint</DialogTitle>
          <p className="text-muted-foreground text-sm">Masukkan data keluhan</p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Alasan Keluhan</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Alasan keluhan" />
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
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      placeholder="Deskripsi Lengkap"
                    />
                  </InputGroup>
                </Field>
              )}
            />

            <Controller
              name="location"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Location</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Lokasi keluhan" />
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
