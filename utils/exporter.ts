import { ScheduleItem } from "../types";

export const exportToCSV = (schedule: ScheduleItem[], className: string, monthName: string) => {
  // Convert basic strings to Uppercase for the filename
  const upperClass = className.toLocaleUpperCase('tr-TR').replace(/[^A-Z0-9ÇĞİÖŞÜ ]/g, '');
  const upperMonth = monthName.toLocaleUpperCase('tr-TR');
  const fileName = `${upperClass} ${upperMonth} AYI NÖBET LİSTESİ`;
  
  // Create HTML Table for Excel
  // This allows us to have borders, colors, and better formatting than CSV
  let tableHTML = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Nöbet Listesi</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000000; padding: 8px; text-align: left; font-family: Arial, sans-serif; }
        .header { background-color: #f0f0f0; font-weight: bold; text-align: center; font-size: 14px; }
        .title { font-size: 16px; font-weight: bold; text-align: center; height: 40px; border: 2px solid #000000; }
        .weekend { background-color: #ffe6e6; color: #cc0000; font-style: italic; }
        .holiday { background-color: #e6f3ff; color: #0066cc; font-weight: bold; }
        .student { font-weight: bold; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="5" class="title">${fileName}</td>
        </tr>
        <tr>
          <th class="header" style="width: 120px;">Tarih</th>
          <th class="header" style="width: 100px;">Gün</th>
          <th class="header" style="width: 200px;">1. Öğrenci</th>
          <th class="header" style="width: 200px;">2. Öğrenci</th>
          <th class="header" style="width: 150px;">Durum</th>
        </tr>
  `;

  schedule.forEach(item => {
    const dateStr = item.date.toLocaleDateString('tr-TR');
    const dayName = item.date.toLocaleDateString('tr-TR', { weekday: 'long' });
    
    let rowClass = "";
    let statusText = "Nöbet";
    let student1Html = `<span class="student">${item.student1}</span>`;
    let student2Html = `<span class="student">${item.student2}</span>`;

    // Priority: Holiday > Weekend
    // This ensures specific holidays (like Semester) are shown even if they fall on a weekend
    if (item.isHoliday) {
      rowClass = "holiday";
      statusText = "Tatil";
      const hName = item.holidayName || "Resmi Tatil";
      student1Html = hName;
      student2Html = hName;
    } else if (item.isWeekend) {
      rowClass = "weekend";
      statusText = "Tatil";
      student1Html = "Hafta Sonu";
      student2Html = "Hafta Sonu";
    }

    tableHTML += `
      <tr>
        <td class="${rowClass}">${dateStr}</td>
        <td class="${rowClass}">${dayName}</td>
        <td class="${rowClass}">${student1Html}</td>
        <td class="${rowClass}">${student2Html}</td>
        <td class="${rowClass}">${statusText}</td>
      </tr>
    `;
  });

  tableHTML += `
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.xls`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};