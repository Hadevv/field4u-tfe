"use client";

/**
 * hook pour formater les coordonnées gps en format professionnel (degrés, minutes, secondes)
 * et fournir une fonction pour copier dans le presse-papier
 */
export function useFormatGps(latitude: number, longitude: number) {
  // conversion décimal vers dms (degrés, minutes, secondes)
  const convertToDms = (coordinate: number, isLatitude: boolean) => {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    const direction = isLatitude
      ? coordinate >= 0
        ? "N"
        : "S"
      : coordinate >= 0
        ? "E"
        : "W";

    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  // formatage des coordonnées
  const formattedLat = convertToDms(latitude, true);
  const formattedLng = convertToDms(longitude, false);
  const formattedCoords = `${formattedLat} ${formattedLng}`;

  // formatage pour le presse-papier (avec plus de détails)
  const clipboardText = `${formattedCoords} (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;

  // fonction pour copier dans le presse-papier
  const copyToClipboard = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(clipboardText).catch((error) => {
        console.error("erreur lors de la copie dans le presse-papier:", error);
      });
    }
  };

  return {
    formattedCoords,
    clipboardText,
    copyToClipboard,
  };
}
