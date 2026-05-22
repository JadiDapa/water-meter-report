"use client";
import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { CreateBuildingSchema } from "@/servers/validators/building.validator";
import { createBuilding } from "@/app/actions/building.actions";

type BuildingFormType = z.infer<typeof CreateBuildingSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateBuildingDialog({ open, onOpenChange }: Props) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<BuildingFormType>({
    resolver: zodResolver(CreateBuildingSchema),
    defaultValues: {
      slug: "",
      name: "",
      description: "",
    },
  });

  function onSubmit(values: BuildingFormType) {
    startTransition(async () => {
      try {
        await createBuilding(values);
        toast.success("Gedung ditambahkan!");
        form.reset();
        onOpenChange(false);
      } catch {
        toast.error("Gagal menambahkan gedung");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Gedung</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Masukkan data gedung baru
          </p>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Nama</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Nama gedung" />
                  </InputGroup>
                </Field>
              )}
            />
            <Controller
              name="slug"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Slug</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="slug-gedung" />
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
                      placeholder="Deskripsi (opsional)"
                    />
                  </InputGroup>
                </Field>
              )}
            />
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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
