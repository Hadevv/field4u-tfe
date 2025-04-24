"use client";

import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { FileImage, X, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export type FileWithPreview = {
  file: File;
  preview: string;
};

type FilesDropzoneProps = {
  onChange: (urls: string[]) => void;
  value?: string[];
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxSizeMB?: number;
  className?: string;
  onSelectFiles?: (files: File[]) => void;
};

export function FilesDropzone({
  onChange,
  value = [],
  maxFiles = 3,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/jpg"],
  maxSizeMB = 2,
  className,
  onSelectFiles,
}: FilesDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  // obtenir le nombre total de fichiers
  const totalFiles = value.length + files.length;
  const remainingSlots = maxFiles - totalFiles;

  // gérer le drop de fichiers
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (remainingSlots <= 0) {
        toast.error(`Vous ne pouvez pas ajouter plus de ${maxFiles} images`);
        return;
      }

      const droppedFiles = Array.from(e.dataTransfer.files).slice(
        0,
        remainingSlots,
      );

      const validFiles = droppedFiles.filter((file) => {
        if (!acceptedFileTypes.includes(file.type)) {
          toast.error(`Le type de fichier "${file.type}" n'est pas accepté`, {
            description: `Types acceptés: ${acceptedFileTypes.join(", ")}`,
          });
          return false;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(`Le fichier "${file.name}" est trop volumineux`, {
            description: `Taille maximale: ${maxSizeMB}MB`,
          });
          return false;
        }

        return true;
      });

      if (validFiles.length === 0) return;

      const filesWithPreviews = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setFiles((prev) => {
        const newFiles = [...prev, ...filesWithPreviews];
        // appeler le callback avec les fichiers bruts
        if (onSelectFiles) {
          onSelectFiles(newFiles.map((f) => f.file));
        }
        return newFiles;
      });
    },
    [acceptedFileTypes, maxFiles, maxSizeMB, remainingSlots, onSelectFiles],
  );

  // gerer la sélection de fichiers via input
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;

      // simuler un drop avec les fichiers sélectionnés
      const dummyEvent = {
        preventDefault: () => {},
        dataTransfer: {
          files: e.target.files,
        },
      } as unknown as React.DragEvent<HTMLDivElement>;

      handleDrop(dummyEvent);

      e.target.value = "";
    },
    [handleDrop],
  );

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const newFiles = [...prev];

        URL.revokeObjectURL(newFiles[index].preview);
        newFiles.splice(index, 1);

        if (onSelectFiles) {
          onSelectFiles(newFiles.map((f) => f.file));
        }

        return newFiles;
      });
    },
    [onSelectFiles],
  );

  // supprimer une image déjà téléchargée
  const removeUploadedFile = useCallback(
    (index: number) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
    },
    [onChange, value],
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* zone de prévisualisation des images */}
      {(value.length > 0 || files.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* images déjà téléchargées */}
          {value.map((url, index) => (
            <div
              key={`uploaded-${index}`}
              className="relative aspect-square rounded-lg overflow-hidden border border-border group"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-full"
                  onClick={() => removeUploadedFile(index)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          ))}

          {/* prévi des fichiers en attente d'upload */}
          {files.map((file, index) => (
            <div
              key={`preview-${index}`}
              className="relative aspect-square rounded-lg overflow-hidden border border-border group"
            >
              <img
                src={file.preview}
                alt={file.file.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-full"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* zone de drop et upload */}
      {remainingSlots > 0 && (
        <div className="space-y-4">
          {/* zone de drop */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-all",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20 hover:border-primary hover:bg-muted/10 cursor-pointer",
              className,
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => {
              document.getElementById("file-upload")?.click();
            }}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept={acceptedFileTypes.join(",")}
              onChange={handleFileChange}
              multiple={remainingSlots > 1}
            />

            <div className="flex flex-col items-center justify-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <UploadCloud
                  className={cn(
                    "h-8 w-8",
                    isDragging ? "text-primary" : "text-muted-foreground",
                  )}
                />
              </div>
              <div className="space-y-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isDragging && "text-primary",
                  )}
                >
                  {isDragging
                    ? "Déposez vos fichiers ici"
                    : "Glissez-déposez vos fichiers ici"}
                </p>
                <p className="text-xs text-muted-foreground">
                  ou <span className="underline">parcourez</span> vos fichiers
                </p>
              </div>
            </div>
          </div>

          {/* informations sur les fichiers */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileImage className="h-3 w-3" />
              <span>
                {totalFiles}/{maxFiles} images
              </span>
            </div>
            <Separator orientation="vertical" className="h-3" />
            <span>Max {maxSizeMB}MB par image</span>
            <Separator orientation="vertical" className="h-3" />
            <span>
              {acceptedFileTypes
                .map((type) => type.replace("image/", ""))
                .join(", ")
                .toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
