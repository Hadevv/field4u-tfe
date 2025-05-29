import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileX } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Annonce introuvable - Field4u",
  description:
    "L'annonce que vous essayez de modifier n'existe pas ou a été supprimée",
};

export default function NotFound() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Annonce introuvable</LayoutTitle>
        <LayoutDescription>
          L'annonce que vous essayez de modifier n'existe pas ou a été supprimée
        </LayoutDescription>
      </LayoutHeader>

      <LayoutContent>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <FileX className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Annonce introuvable</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            L'annonce que vous essayez de modifier n'existe pas ou a été
            supprimée. Elle pourrait avoir été supprimée récemment ou vous
            n'avez pas les permissions pour y accéder.
          </p>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/farm/announcements">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux annonces
              </Link>
            </Button>
            <Button asChild>
              <Link href="/farm/announcements/new">
                Créer une nouvelle annonce
              </Link>
            </Button>
          </div>
        </div>
      </LayoutContent>
    </Layout>
  );
}
