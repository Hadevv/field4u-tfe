import { Heart, Leaf, Star, ThumbsUp } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon: "participate" | "favorite" | "like" | "review";
};

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  const getIcon = () => {
    switch (icon) {
      case "participate":
        return <Leaf className="h-12 w-12 text-primary/40" />;
      case "favorite":
        return <Heart className="h-12 w-12 text-primary/40" />;
      case "like":
        return <ThumbsUp className="h-12 w-12 text-primary/40" />;
      case "review":
        return <Star className="h-12 w-12 text-primary/40" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 border rounded-lg border-dashed border-muted">
      <div className="bg-primary/10 rounded-full p-4 mb-4">{getIcon()}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
