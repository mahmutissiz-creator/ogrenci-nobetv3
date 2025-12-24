import React from 'react';
import { ScheduleItem } from '../types';
import { Download, Calendar, User } from 'lucide-react';
import { exportToCSV } from '../utils/exporter';

interface ScheduleTableProps {
  schedule: ScheduleItem[];
  className: string;
  monthName: string;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule, className, monthName }) => {
  if (schedule.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center">
        <Calendar className="w-16 h-16 text-gray-200 mb-4" />
        <h3 className="text-xl font-medium text-gray-900">Liste Oluşturulmadı</h3>
        <p className="text-gray-500 mt-2">Sol menüden sınıfınızı ve öğrencilerinizi seçip listeyi oluşturun.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{className} Nöbet Listesi</h2>
          <p className="text-gray-500 text-sm mt-1">{monthName} dönemi için oluşturuldu</p>
        </div>
        <button
          onClick={() => exportToCSV(schedule, className, monthName)}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Excel (CSV) İndir
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">Tarih</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">Gün</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">1. Nöbetçi</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">2. Nöbetçi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedule.map((item, idx) => {
              const isInactive = item.isWeekend || item.isHoliday;
              return (
                <tr 
                  key={idx} 
                  className={`
                    hover:bg-blue-50/50 transition-colors
                    ${isInactive ? 'bg-gray-50/80' : 'bg-white'}
                  `}
                >
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.date.toLocaleDateString('tr-TR', { weekday: 'long' })}
                  </td>
                  
                  {isInactive ? (
                    <td colSpan={2} className="px-6 py-3 text-center text-sm font-medium text-gray-400 italic bg-gray-100/50">
                      {item.isHoliday ? (item.holidayName || 'Resmi Tatil') : 'Hafta Sonu'}
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">1</div>
                           {item.student1}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-bold">2</div>
                           {item.student2}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};