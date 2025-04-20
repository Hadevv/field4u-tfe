import { cancelGleaningAction } from "./actions";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CancelGleaningButton({
  gleaningId,
  announcementId,
}: {
  gleaningId: string;
  announcementId: string;
}) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(
        cancelGleaningAction({
          gleaningId,
          announcementId,
        }),
      );
    },
    onSuccess: () => {
      toast.success("glanage annulé avec succès");
      router.refresh();
    },
    onError: (error) => {
      toast.error("erreur lors de l'annulation", {
        description: error.message,
      });
    },
  });

  return (
    <Button
      variant="destructive"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "annulation..." : "annuler le glanage"}
    </Button>
  );
}
