import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string, sheetName: string = "Data") => {
  // 1. Buat worksheet dari data JSON
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // 2. Buat workbook baru
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // 3. Generate file dan download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
