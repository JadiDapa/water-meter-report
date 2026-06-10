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
import { CreateTechnicianSchema } from "@/servers/validators/technician.validator";
import { createTechnician } from "@/app/actions/technician.action";
type TechnicianFormType = z.infer<typeof CreateTechnicianSchema>;
export default function CreateTechnicianDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<TechnicianFormType>({
    resolver: zodResolver(CreateTechnicianSchema),
    defaultValues: {
      userId: 1,
      fullname: "",
      phoneNumber: "",
      region: "",
    },
  });
  async function onSubmit(values: TechnicianFormType) {
    startTransition(async () => {
      try {
        await createTechnician({ ...values });
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
        <Button className="w-full cursor-pointer hover:bg-white sm:w-auto">
          <p className="text-center font-semibold">Tambah Technician</p>
          <Plus className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Technician</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Masukkan data technician
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
