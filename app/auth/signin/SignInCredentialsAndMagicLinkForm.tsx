"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "react-use";
import { z } from "zod";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

const LoginCredentialsFormScheme = z.object({
  email: z.string().email("veuillez saisir un email valide"),
  password: z
    .string()
    .min(8, "le mot de passe doit contenir au moins 8 caractères")
    .optional(),
});

type LoginCredentialsFormType = z.infer<typeof LoginCredentialsFormScheme>;

export const SignInCredentialsAndMagicLinkForm = () => {
  const form = useZodForm({
    schema: LoginCredentialsFormScheme,
  });
  const searchParams = useSearchParams();
  const [isUsingCredentials, setIsUsingCredentials] = useLocalStorage(
    "sign-in-with-credentials",
    false,
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: LoginCredentialsFormType) {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signIn(
        isUsingCredentials ? "credentials" : "resend",
        {
          email: values.email,
          password: values.password,
          redirect: false,
        },
      );

      if (result?.error) {
        // utiliser l'api pour obtenir un message d'erreur plus détaillé
        const errorResponse = await fetch("/api/auth/error-handler", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: result.error }),
        });

        const errorData = await errorResponse.json();
        setAuthError(
          errorData.errorMessage ||
            "échec de l'authentification, veuillez réessayer",
        );
        setIsSubmitting(false);
        return;
      }

      const session = await getSession();
      if (session?.user?.onboardingCompleted) {
        window.location.href = searchParams.get("callbackUrl") ?? "/";
      } else {
        window.location.href = "/auth/onboarding";
      }
    } catch (error) {
      setAuthError(
        "une erreur s'est produite lors de la connexion, veuillez réessayer",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="max-w-lg space-y-4">
      {authError && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            {isUsingCredentials ? <FormLabel>Email</FormLabel> : null}
            <FormControl>
              <Input placeholder="john@doe.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {isUsingCredentials ? (
        <>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ) : (
        <Typography
          variant="link"
          as="button"
          type="button"
          className="text-sm"
          onClick={() => {
            setIsUsingCredentials(true);
          }}
        >
          Use password
        </Typography>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isUsingCredentials ? "Login with Password" : "Login with MagicLink"}
      </Button>

      {isUsingCredentials && (
        <Typography variant="small">
          Forgot password ?{" "}
          <Typography
            variant="link"
            as="button"
            type="button"
            onClick={() => {
              setIsUsingCredentials(false);
            }}
          >
            Login with magic link
          </Typography>
        </Typography>
      )}
    </Form>
  );
};
