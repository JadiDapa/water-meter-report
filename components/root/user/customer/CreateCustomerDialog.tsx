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
      userId: 1,
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
        toast.success("Ticket created!");
        setOpen(false);
      } catch {
        toast.error("Something went wrong");
      }
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer hover:bg-white">
          <p className="text-center font-semibold">Tambah Customer</p>
          <Plus className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Customer</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Masukkan data customer
          </p>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <div className="flex gap-4">
              <Controller
                name="fullname"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Nama Bagian" />
                    </InputGroup>
                  </Field>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Controller
                name="customerId"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Customer ID</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Nama Bagian" />
                    </InputGroup>
                  </Field>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Phone Number</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Nomor Telepon" />
                    </InputGroup>
                  </Field>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Controller
                name="address"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Address</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Alamat" />
                    </InputGroup>
                  </Field>
                )}
              />
            </div>

            <Controller
              name="buildingSlug"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Building</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={"Pilih Building..."} />
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
