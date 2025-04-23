import { utils, writeFileXLSX } from "xlsx";
import { toast } from "sonner";

const prepareExportData = <T extends Record<string, unknown>>(
  data: T[],
  keysToExclude: string[] = [],
  customHeaders: Record<string, string> = {},
): Record<string, unknown>[] => {
  return data.map((item) => {
    const exportItem: Record<string, unknown> = {};

    for (const key in item) {
      if (!keysToExclude.includes(key)) {
        const headerKey = customHeaders[key] || key;
        exportItem[headerKey] = item[key];
      }
    }

    return exportItem;
  });
};

export const exportToExcel = <T extends Record<string, unknown>>(
  data: T[],
  fileName: string,
  keysToExclude: string[] = [],
  customHeaders: Record<string, string> = {},
): void => {
  try {
    if (!data.length) {
      toast.error("aucune donnée à exporter");
      return;
    }

    const exportData = prepareExportData(data, keysToExclude, customHeaders);

    const worksheet = utils.json_to_sheet(exportData);

    const maxWidth = 50;
    const columnsWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.min(maxWidth, Math.max(10, key.length + 2)),
    }));
    worksheet["!cols"] = columnsWidths;

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Données");

    const dateStr = new Date().toISOString().split("T")[0];
    const fullFileName = `${fileName}-${dateStr}.xlsx`;

    writeFileXLSX(workbook, fullFileName);
    toast.success(`exportation réussie: ${fullFileName}`);
  } catch (error) {
    console.error("Erreur lors de l'exportation:", error);
    toast.error("erreur lors de l'exportation");
  }
};
