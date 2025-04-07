import * as ExcelJS from 'exceljs';

export const ExportXLSX = {
  async exportExcel(data: any[], template: ArrayBuffer, sheetName: string, filename: string) {
    var workbook = new ExcelJS.Workbook();
    workbook.xlsx.load(template).then(() => {
      const worksheet = workbook.getWorksheet(sheetName);
      const dt = Object.entries(data);
      dt.forEach((element, index) => {
        const keys = Object.keys(element[1]);
        const values = keys.map((key) => element[1][key]);
        worksheet?.addRow([parseInt(element[0]) + 1, ...values], 'i');
      });
      this.downloadFile(workbook, filename);
    });
  },

  async downloadFile(workbook: ExcelJS.Workbook, fileName: string) {
    workbook.creator = 'Field Work Management';
    workbook.lastModifiedBy = 'Field Work Management';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // Adjust MIME type as needed
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    // Hide the anchor element
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  }
};
