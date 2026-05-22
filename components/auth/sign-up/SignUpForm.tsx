"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";
import { Eye, EyeClosed, Lock, User, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "@/app/action/user.actions";

const signUpSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

type SignUpFormType = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { signUp } = useSignUp();
  const { loaded } = useClerk();
  const router = useRouter();

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", username: "", password: "" },
  });

  async function onSubmit(values: SignUpFormType) {
    startTransition(async () => {
      if (!loaded || !signUp) return;

      try {
        // 1. Register to Clerk
        const { error } = await signUp.password({
          username: values.username,
          firstName: values.name,
          password: values.password,
        });

        if (error) {
          toast.error("Pendaftaran gagal");
          console.error(error);
          return;
        }

        if (signUp.status !== "complete") {
          toast.error("Pendaftaran memerlukan langkah tambahan");
          return;
        }

        // 2. Save to your database (role defaults to USER via schema)
        await createUser({
          username: values.username,
          name: values.name,
          role: "USER",
        });

        // 3. Set active session and redirect
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            router.push(decorateUrl("/"));
          },
        });
      } catch (err) {
        console.error(err);
        toast.error("Terjadi kesalahan, coba lagi");
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mt-4 w-full lg:mt-6"
    >
      <FieldGroup>
        <div className="space-y-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field>
                <InputGroup className="h-12">
                  <InputGroupInput
                    {...field}
                    className="ml-2"
                    placeholder="Nama Lengkap"
                    autoComplete="name"
                  />
                  <InputGroupAddon>
                    <IdCard />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Field>
                <InputGroup className="h-12">
                  <InputGroupInput
                    {...field}
                    className="ml-2"
                    placeholder="Username"
                    autoComplete="username"
                  />
                  <InputGroupAddon>
                    <User />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field>
                <InputGroup className="h-12">
                  <InputGroupAddon>
                    <Lock />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    className="ml-2"
                    type={isVisible ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="new-password"
                  />
                  <InputGroupAddon
                    align="inline-end"
                    className="cursor-pointer"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <Eye /> : <EyeClosed />}
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />
        </div>

        <div id="clerk-captcha" />

        <Button
          type="submit"
          disabled={isPending || !loaded}
          className="flex h-10 w-full items-center gap-3 text-lg lg:h-12"
        >
          {isPending ? <Spinner /> : "Daftar"}
        </Button>
      </FieldGroup>
    </form>
  );
}
