import { Leaf, MapPin } from "lucide-react";

type GleaningReviewHeaderProps = {
  title: string;
  cropTypeName: string;
  fieldName: string;
  fieldCity: string;
};

export function GleaningReviewHeader({
  title,
  cropTypeName,
  fieldName,
  fieldCity,
}: GleaningReviewHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-4">
        partagez votre expérience et aidez la communauté
      </p>

      <div className="flex flex-wrap gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <Leaf className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-sm">{cropTypeName}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-sm">
            {fieldName || "champ"} - {fieldCity}
          </span>
        </div>
      </div>
    </div>
  );
}
