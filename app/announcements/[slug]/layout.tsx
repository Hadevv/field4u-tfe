import { Card, CardContent } from "@/components/ui/card";
import { GleaningStepper } from "@/features/stepper/GleaningStepper";

export default function AnnouncementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto pt-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Stepper sur le côté gauche */}
        <Card className="hidden md:block w-full md:w-[240px] bg-blanc-special overflow-hidden shadow-sm">
          <CardContent className="p-6">
            <GleaningStepper variant="vertical" />
          </CardContent>
        </Card>

        {/* version mobile du stepper - visible seulement sur mobile */}
        <Card className="md:hidden w-full mb-6 bg-blanc-special overflow-hidden shadow-sm">
          <CardContent className="p-4">
            <GleaningStepper variant="horizontal" />
          </CardContent>
        </Card>

        {/* contenu principal */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
