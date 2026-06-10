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
import { CreateCustomerSchema } from "@/servers/validators/customer.validator";
import { createCustomer } from "@/app/actions/customer.actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BuildingType } from "@/servers/validators/building.validator";

type CustomerFormType = z.infer<typeof CreateCustomerSchema>;

export default function CreateCustomerDialog({
  buildings,
}: {
  buildings: BuildingType[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CustomerFormType>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      customerId: "",
      fullname: "",
      phoneNumber: "",
      address: "",
      buildingSlug: "",
    },
  });

  async function onSubmit(values: CustomerFormType) {
    startTransition(async () => {
      try {
        await createCustomer({ ...values });
        toast.success("Pelanggan berhasil ditambahkan!");
        form.reset();
        setOpen(false);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan";
        toast.error(message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full cursor-pointer hover:bg-white sm:w-auto">
          <p className="text-center font-semibold">Tambah Pelanggan</p>
          <Plus className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Pelanggan</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Akun akan dibuat dengan username{" "}
            <span className="font-mono">p_[nomor telepon]</span> dan password =
            ID pelanggan.
          </p>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <div className="flex gap-4">
              <Controller
                name="fullname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Nama Lengkap</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Nama lengkap" />
                    </InputGroup>
                    {fieldState.error && (
                      <p className="text-destructive text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Controller
                name="customerId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>ID Pelanggan</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        placeholder="Contoh: CUST-001"
                      />
                    </InputGroup>
                    {fieldState.error && (
                      <p className="text-destructive text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Nomor Telepon</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        placeholder="Contoh: 08123456789"
                      />
                    </InputGroup>
                    {fieldState.error && (
                      <p className="text-destructive text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Alamat</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Alamat lengkap" />
                    </InputGroup>
                    {fieldState.error && (
                      <p className="text-destructive text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="buildingSlug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Bangunan</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bangunan..." />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((b) => (
                        <SelectItem key={b.id} value={b.slug}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-destructive text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
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
