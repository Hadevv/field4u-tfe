"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { SiteConfig } from "@/site-config";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { contactSupportAction } from "./contact-support.action";
import type { ContactSupportSchemaType } from "./contact-support.schema";
import { ContactSupportSchema } from "./contact-support.schema";

export type ContactSupportDialogProps = PropsWithChildren<{
  onSuccess?: () => void;
}>;

export const ContactSupportDialog = (props: ContactSupportDialogProps) => {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const email = session.data?.user.email ?? "";
  const form = useZodForm({
    schema: ContactSupportSchema,
    defaultValues: {
      email: email,
    },
  });

  const onSubmit = async (values: ContactSupportSchemaType) => {
    const result = await contactSupportAction(values);

    if (!result?.data) {
      toast.error(result?.serverError);
      return;
    }

    toast.success("Votre message a été envoyé.");
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        {props.children ? (
          props.children
        ) : (
          <Button size="sm" variant="outline">
            Contact support
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous ou envoyez un email à{" "}
            <Link
              className="text-primary"
              href={`mailto:${SiteConfig.email.contact}`}
            >
              {SiteConfig.email.contact}
            </Link>
            .
          </DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={async (v) => onSubmit(v)}
          className="flex flex-col gap-4"
        >
          {email ? null : (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sujet</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="sm">
            Envoyer
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const ContactSupportLink = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <ContactSupportDialog>
      <span className={props.className}>{props.children}</span>
    </ContactSupportDialog>
  );
};
