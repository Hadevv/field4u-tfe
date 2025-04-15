"use client";

import { useState, useRef } from "react";
import { submitReviewAction } from "./submit-review.action";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Loader2, Send, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilesDropzone } from "@/features/upload/FilesDropzone";
import { Label } from "@/components/ui/label";

const ReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  content: z
    .string()
    .min(3, "votre avis doit contenir au moins 3 caractères")
    .max(500, "votre avis est trop long (max 500 caractères)"),
});

type ReviewFormProps = {
  gleaningId: string;
};

export function ReviewForm({ gleaningId }: ReviewFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const filesRef = useRef<File[]>([]);

  const form = useZodForm({
    schema: ReviewSchema,
    defaultValues: {
      rating: 5,
      content: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: z.infer<typeof ReviewSchema>) => {
      // créer un formdata pour les fichiers
      const formData = new FormData();

      // ajouter les fichiers au formdata
      filesRef.current.forEach((file) => {
        formData.append("files", file);
      });

      return resolveActionResult(
        submitReviewAction({
          ...data,
          gleaningId,
          images,
          imageFiles: filesRef.current.length > 0 ? formData : undefined,
        }),
      );
    },
    onSuccess: () => {
      toast.success("merci pour votre évaluation!");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFilesChange = (urls: string[]) => {
    setImages(urls);
  };

  const handleFileObjects = (files: File[]) => {
    filesRef.current = files;
  };

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">votre évaluation</h2>

        <Form
          form={form}
          onSubmit={(data) => {
            submitMutation.mutate(data);
          }}
        >
          {/* rating stars */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>note</FormLabel>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-10 w-10",
                        star <= field.value ? "text-yellow-500" : "text-muted",
                      )}
                      onClick={() => field.onChange(star)}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* image upload */}
          <div className="mb-6">
            <Label>photos de votre récolte (optionnel)</Label>
            <FilesDropzone
              onChange={(urls) => handleFilesChange(urls)}
              onSelectFiles={handleFileObjects}
              value={images}
              maxFiles={5}
              className="h-32"
            />
          </div>

          {/* review text */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>votre avis</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="partagez votre expérience avec ce glanage..."
                    className="min-h-32 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="gap-2"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              publier mon avis
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
