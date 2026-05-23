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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { CreateUserSchema } from "@/servers/validators/user.validator";
import { createUser } from "@/app/actions/user.actions";

type UserFormType = z.infer<typeof CreateUserSchema>;

export default function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<UserFormType>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  async function onSubmit(values: UserFormType) {
    startTransition(async () => {
      try {
        await createUser({ ...values });
        toast.success("Pengguna ditambahkan!");
        form.reset();
        setOpen(false);
      } catch {
        toast.error("Gagal menambahkan pengguna");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <p className="text-center font-semibold">Tambah User</p>
          <Plus className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Masukkan data pengguna baru
          </p>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Nama</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Nama lengkap" />
                  </InputGroup>
                  {fieldState.error && (
                    <p className="text-destructive mt-1 text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Username</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Username" />
                  </InputGroup>
                  {fieldState.error && (
                    <p className="text-destructive mt-1 text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </InputGroup>
                  {fieldState.error && (
                    <p className="text-destructive mt-1 text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
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
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
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
