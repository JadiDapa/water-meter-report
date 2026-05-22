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
import { UpdateCustomerSchema, CustomerType } from "@/servers/validators/customer.validator";
import { updateCustomer } from "@/app/actions/customer.actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BuildingType } from "@/servers/validators/building.validator";

type CustomerFormType = z.infer<typeof UpdateCustomerSchema>;

interface Props {
  customer: CustomerType;
  buildings: BuildingType[];
}

export default function EditCustomerDialog({ customer, buildings }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CustomerFormType>({
    resolver: zodResolver(UpdateCustomerSchema),
    defaultValues: {
      customerId: customer.customerId,
      fullname: customer.fullname,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      buildingSlug: customer.buildingSlug,
    },
  });

  function onSubmit(values: CustomerFormType) {
    startTransition(async () => {
      try {
        await updateCustomer(customer.id, values);
        toast.success("Pelanggan diperbarui");
        setOpen(false);
      } catch {
        toast.error("Gagal memperbarui pelanggan");
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
          <DialogTitle>Edit Pelanggan</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Perbarui data pelanggan
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
              name="customerId"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>ID Pelanggan</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="ID Pelanggan" />
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
              name="address"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Alamat</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Alamat" />
                  </InputGroup>
                </Field>
              )}
            />
            <Controller
              name="buildingSlug"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Gedung</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Gedung..." />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((b) => (
                        <SelectItem key={b.id} value={b.slug}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
