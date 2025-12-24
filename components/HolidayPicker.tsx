import React, { useState } from 'react';
import { Holiday } from '../types';
import { CalendarOff, Plus, X } from 'lucide-react';

interface HolidayPickerProps {
  holidays: Holiday[];
  setHolidays: (holidays: Holiday[]) => void;
}

export const HolidayPicker: React.FC<HolidayPickerProps> = ({ holidays, setHolidays }) => {
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');

  const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

  const addHoliday = () => {
    if (!date) return;
    
    // Check duplicate
    if (holidays.some(h => h.date === date)) {
      alert("Bu tarih zaten ekli.");
      return;
    }

    const newHoliday: Holiday = {
      id: generateId(),
      date,
      description: desc || 'Resmi Tatil'
    };
    
    // Sort by date
    const updated = [...holidays, newHoliday].sort((a, b) => a.date.localeCompare(b.date));
    setHolidays(updated);
    
    setDate('');
    setDesc('');
  };

  const removeHoliday = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
       <div className="flex items-center gap-2 mb-4">
        <CalendarOff className="w-5 h-5 text-orange-600" />
        <h2 className="text-lg font-semibold text-gray-800">Tatil Günleri</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="flex gap-2">
            <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Açıklama (örn: 23 Nisan)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
            onClick={addHoliday}
            disabled={!date}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg transition-colors"
            >
            <Plus className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-[150px]">
        {holidays.length === 0 ? (
           <div className="text-center text-gray-400 py-8 text-sm">
             Henüz tatil günü eklenmedi.
           </div>
        ) : (
          holidays.map(h => (
            <div key={h.id} className="flex items-center justify-between bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
              <div>
                <div className="text-sm font-semibold text-gray-800">
                    {new Date(h.date).toLocaleDateString('tr-TR')}
                </div>
                <div className="text-xs text-gray-600">{h.description}</div>
              </div>
              <button
                onClick={() => removeHoliday(h.id)}
                className="text-orange-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};