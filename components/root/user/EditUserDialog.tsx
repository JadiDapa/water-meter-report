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
import { UpdateUserSchema } from "@/servers/validators/user.validator";
import { updateUser } from "@/app/actions/user.actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserFormType = z.infer<typeof UpdateUserSchema>;

interface Props {
  user: { id: number; name: string; username: string; role: string };
}

export default function EditUserDialog({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<UserFormType>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      role: user.role as "ADMIN" | "CUSTOMER" | "TECHNICIAN",
    },
  });

  function onSubmit(values: UserFormType) {
    startTransition(async () => {
      try {
        await updateUser(user.id, values);
        toast.success("Pengguna diperbarui");
        setOpen(false);
      } catch {
        toast.error("Gagal memperbarui pengguna");
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
          <DialogTitle>Edit Pengguna</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Perbarui data pengguna
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
                    <InputGroupInput {...field} placeholder="Nama lengkap" />
                  </InputGroup>
                </Field>
              )}
            />
            <Controller
              name="username"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Username</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Username" />
                  </InputGroup>
                </Field>
              )}
            />
            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="TECHNICIAN">Teknisi</SelectItem>
                      <SelectItem value="CUSTOMER">Pelanggan</SelectItem>
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
