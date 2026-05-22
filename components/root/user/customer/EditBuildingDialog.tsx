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
import { UpdateBuildingSchema, BuildingType } from "@/servers/validators/building.validator";
import { updateBuilding } from "@/app/actions/building.actions";

type BuildingFormType = z.infer<typeof UpdateBuildingSchema>;

export default function EditBuildingDialog({ building }: { building: BuildingType }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<BuildingFormType>({
    resolver: zodResolver(UpdateBuildingSchema),
    defaultValues: {
      slug: building.slug,
      name: building.name,
      description: building.description ?? "",
    },
  });

  function onSubmit(values: BuildingFormType) {
    startTransition(async () => {
      try {
        await updateBuilding(building.id, values);
        toast.success("Gedung diperbarui");
        setOpen(false);
      } catch {
        toast.error("Gagal memperbarui gedung");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Gedung</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Perbarui data gedung
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
                    <InputGroupInput {...field} placeholder="Deskripsi (opsional)" />
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
