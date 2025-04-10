import { UTApi } from "uploadthing/server";

/**
 * classe pour gerer les uploads d'images vers UploadThing
 * avec une interface plus propre et professionnelle
 */
export class UploadManager {
  private api: UTApi;

  constructor() {
    this.api = new UTApi();
  }

  /**
   * telecharge des fichiers vers UploadThing
   *
   * @param files - Liste des fichiers à télécharger
   * @param options - Options supplémentaires
   * @returns Liste des URLs des fichiers téléchargés
   */
  async uploadFiles(
    files: File[],
    options?: { maxSizeMB?: number },
  ): Promise<string[]> {
    if (!files.length) {
      throw new Error("Aucun fichier fourni");
    }

    const maxSizeMB = options?.maxSizeMB || 2;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // verifier les fichiers avant de les envoyer
    for (const file of files) {
      if (!(file instanceof File)) {
        throw new Error("Format de fichier invalide");
      }

      // verifier que c'est bien une image
      if (!file.type.startsWith("image/")) {
        throw new Error(`Le fichier "${file.name}" n'est pas une image`);
      }

      // verifier la taille
      if (file.size > maxSizeBytes) {
        throw new Error(
          `Le fichier "${file.name}" dépasse la taille maximale de ${maxSizeMB}MB`,
        );
      }
    }

    try {
      const responses = await this.api.uploadFiles(files);

      const errors = responses.filter((response) => response.error);
      if (errors.length) {
        throw new Error(errors[0].error?.message || "Erreur lors de l'upload");
      }
      return responses
        .filter((response) => response.data)
        .map((response) => response.data!.ufsUrl);
    } catch (error) {
      console.error("Erreur lors de l'upload des fichiers:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'upload des fichiers",
      );
    }
  }

  /**
   * supprime des fichiers de UploadThing
   *
   * @param fileKeys - Liste des clés de fichiers à supprimer
   */
  async deleteFiles(fileKeys: string | string[]): Promise<void> {
    if (!fileKeys || (Array.isArray(fileKeys) && fileKeys.length === 0)) {
      return;
    }

    try {
      await this.api.deleteFiles(fileKeys);
    } catch (error) {
      console.error("Erreur lors de la suppression des fichiers:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression des fichiers",
      );
    }
  }
}

// exporter une instance unique pour toute l'application
export const uploadManager = new UploadManager();
