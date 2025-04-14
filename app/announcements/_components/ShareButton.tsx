/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Share2,
  CopyIcon,
  Facebook,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ShareButtonProps = {
  title: string;
  slug: string;
  className?: string;
};

export function ShareButton({ title, slug, className }: ShareButtonProps) {
  const getShareUrl = () => {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined" && window.location.origin);
    return `${baseUrl}/announcements/${slug}`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    const html = `<a href="${url}">Field4u - ${title}</a>`;
    try {
      if (navigator.clipboard && (navigator.clipboard as any).write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([url], { type: "text/plain" }),
          }),
        ]);
      } else {
        navigator.clipboard.writeText(url);
      }
      toast.success("Lien cliquable copié dans le presse-papier !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la copie du lien !");
    }
  };

  const handleShare = (platform: string) => {
    const url = getShareUrl();
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(`Field4u - ${title}`);
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodedTitle}&body=Voici une opportunité sur Field4u ! Découvrez cette annonce en cliquant sur le lien ci-dessous:%0A%0A<a href="${url}">Field4u - ${title}</a>`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
    toast.success(
      `Partagé sur ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("w-10 h-10 bg-background border shadow-sm", className)}
        >
          <Share2 className="w-4 h-4" />
          <span className="sr-only">Partager cette annonce</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => handleShare("facebook")}
          className="cursor-pointer"
        >
          <Facebook className="w-4 h-4 mr-2" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare("email")}
          className="cursor-pointer"
        >
          <Mail className="w-4 h-4 mr-2" />
          <span>Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare("messenger")}
          className="cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          <span>Messenger</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare("whatsapp")}
          className="cursor-pointer"
        >
          <Phone className="w-4 h-4 mr-2" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <CopyIcon className="w-4 h-4 mr-2" />
          <span>Copier le lien cliquable</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
