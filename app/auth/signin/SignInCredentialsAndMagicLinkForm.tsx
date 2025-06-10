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
import { toast } from "sonner";

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
  const [isUsingCredentials, setIsUsingCredentials] = useLocalStorage<boolean>(
    "sign-in-with-credentials",
    false,
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: LoginCredentialsFormType) {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      if (isUsingCredentials) {
        // connexion avec identifiants
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          handleAuthError(result.error);
          return;
        }

        redirectAfterAuth();
      } else {
        // connexion avec magic link
        await signIn("resend", {
          email: values.email,
          redirect: true,
          callbackUrl: "/auth/onboarding",
          verifyCallbackUrl: `/auth/verify-request?email=${encodeURIComponent(values.email)}`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast.error("Erreur lors de la connexion");
      setAuthError(
        "une erreur s'est produite lors de la connexion, veuillez réessayer",
      );
      setIsSubmitting(false);
    }
  }

  const handleAuthError = async (error: string) => {
    const errorResponse = await fetch("/api/auth/error-handler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error }),
    });

    const errorData = await errorResponse.json();
    setAuthError(
      errorData.errorMessage ||
        "échec de l'authentification, veuillez réessayer",
    );
    setIsSubmitting(false);
  };

  const redirectAfterAuth = async () => {
    const session = await getSession();
    if (session?.user?.onboardingCompleted) {
      window.location.href = searchParams.get("callbackUrl") ?? "/";
    } else {
      window.location.href = "/auth/onboarding";
    }
  };

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
              <Input placeholder="adresse e-mail" {...field} />
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
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="mot de passe"
                    type="password"
                    {...field}
                  />
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
          utiliser un mot de passe
        </Typography>
      )}

      <Button
        size="sm"
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isUsingCredentials
          ? "connexion avec mot de passe"
          : "connexion avec un lien magique"}
      </Button>

      {isUsingCredentials && (
        <Typography variant="small">
          mot de passe oublié ?{" "}
          <Typography
            variant="link"
            as="button"
            type="button"
            onClick={() => {
              setIsUsingCredentials(false);
            }}
          >
            connexion avec un lien magique
          </Typography>
        </Typography>
      )}
    </Form>
  );
};
