import { Typography } from "@/components/ui/typography";
import { EmailForm } from "./EmailForm";

export const EmailFormSection = () => {
  return (
    <div className="relative flex w-full flex-col items-center gap-16">
      <div className="relative m-auto flex max-w-xl flex-col gap-4 text-center">
        <Typography
          variant="small"
          className="font-extrabold uppercase text-primary"
        >
          Soyez le premier à utiliser Field4u
        </Typography>
        <Typography variant="h2" className="text-center text-4xl lg:text-5xl">
          Rejoignez la liste d'attente de{" "}
          <span className="text-gradient bg-gradient-to-r from-orange-600 via-red-400 to-yellow-400 font-mono font-extrabold uppercase">
            Field4u
          </span>
        </Typography>
        <Typography variant="h3">
          Recevez l'accès anticipé, du contenu exclusif et plus encore.
        </Typography>
        <div className="mx-auto mt-6 w-full max-w-md">
          <EmailForm
            submitButtonLabel="Join"
            successMessage="Thank you for joining the waiting list"
          />
        </div>
      </div>
    </div>
  );
};
