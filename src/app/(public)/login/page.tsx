"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import InputField from "@/components/molecules/InputField/inputField";
import SignInFormSchema from "@/validations/signIn";
import Button from "@atoms/Button/button";
import useAuth from "@hooks/useAuth";

type SignInForm = z.infer<typeof SignInFormSchema>;

export default function LoginPage() {
  const { loginWithGoogleUser, loginWithInternalService, loading } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<SignInForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(SignInFormSchema)
  });

  const handleSubmitForm = (data: SignInForm) => {
    loginWithInternalService(data.email, data.password);
  };

  return (
    <main className="flex h-screen bg-blue-50 w-full flex-col items-center justify-center gap-5">
      <h1 className="text-2xl font-bold">ONBOARDING SOUV</h1>
      <form
        className="flex w-full bg-gray-50 shadow-xl p-12 max-w-sm flex-col gap-2"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <InputField
          register={register}
          name="email"
          placeholder="email@email.com"
          label="E-mail"
          type="email"
          formErrors={errors}
        />
        <InputField
          register={register}
          name="password"
          placeholder="********"
          label="Senha"
          formErrors={errors}
        />
        <Button className="mt-4 hover:text-blue-400 first-letter:" loading={loading.loginWithInternalService}>
          ENTRAR
        </Button>
      </form>
      <div className="flex gap-5">
        <Link className=" hover:text-blue-400" href="/forgot-password">Esqueci a senha</Link>
        <Link className=" hover:text-blue-400" href="/sign-up">Cadastre-se</Link>
      </div>
      <Button className=" hover:text-blue-400" onClick={loginWithGoogleUser} loading={loading.loginWithGoogle}>
        ENTRAR COM GOOGLE
      </Button>
    </main>
  );
}
