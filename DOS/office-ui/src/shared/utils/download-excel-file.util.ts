import * as XLSX from "xlsx";

export const downloadExcelFile = (data: any, fileName?: string): void => {
  const date = new Date();
  const SHEET_NAME = "Vales";
  const workbook = XLSX.utils.book_new();
  const filename = fileName
    ? `${fileName}.xlsx`
    : `Vales_${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}.xlsx`;
  const dataSheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(
    workbook,
    dataSheet,
    SHEET_NAME.replace("/", "")
  );
  const downloadUrl = window.URL.createObjectURL(
    new Blob([
      XLSX.writeFileXLSX(workbook, filename, {
        type: "buffer",
        bookType: "xlsx",
      }),
    ])
  );
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.onclick = (event) => {
    event.preventDefault();
  };
  // link.setAttribute("download", "test.xlsx");
  link.setAttribute("target", "_self");
  link.click();
  window.URL.revokeObjectURL(downloadUrl);
};
