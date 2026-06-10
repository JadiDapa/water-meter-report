import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignInForm from "@/components/auth/sign-in/SignInForm";
import Image from "next/image";

export default async function SignInPage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) redirect("/");

  return (
    <section className="bg-background relative flex min-h-screen justify-end overflow-hidden">
      <div className="relative hidden h-screen w-full flex-3 lg:flex">
        <Image
          src={"/login-bg.jpeg"}
          fill
          alt=""
          className="object-cover object-bottom-left"
        />
        <div className="bg-primary/40 absolute inset-0 brightness-50" />
      </div>
      <main className="bg-background relative flex w-full flex-1 flex-col items-center justify-center p-8 lg:px-16">
        <div className="w-full space-y-4">
          <Image
            src={
              "https://fornews.co/news/inline/2021/02/Logo-PDAM-Tirta-Musi.png"
            }
            alt=""
            width={100}
            height={100}
            className="relative"
          />{" "}
          <div className="flex items-center justify-between gap-3">
            <p className="text-primary text-4xl font-semibold tracking-wide">
              Silahkan Masuk!
            </p>
          </div>
          <p className="text-muted-foreground mx-auto mt-4 text-sm lg:mt-6">
            Login sebelum mengakses sistem laporan Tirta Musi!
          </p>
        </div>
        <SignInForm />
      </main>
    </section>
  );
}
