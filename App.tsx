import React, { useState, useEffect } from 'react';
import { StudentList } from './components/StudentList';
import { HolidayPicker } from './components/HolidayPicker';
import { ScheduleTable } from './components/ScheduleTable';
import { generateSchedule } from './utils/scheduler';
import { Student, Holiday, ScheduleItem } from './types';
import { Settings, RefreshCw, GraduationCap } from 'lucide-react';

// Safe ID generator for broader browser compatibility
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

// Helper function to generate the default 2025-2026 holidays
const getDefaultHolidays = (): Holiday[] => {
  const initialHolidays: Holiday[] = [];
  const addHoliday = (date: string, description: string) => {
    initialHolidays.push({ id: generateId(), date, description });
  };
  
  const addRange = (startStr: string, endStr: string, description: string) => {
    let current = new Date(startStr);
    const end = new Date(endStr);
    while (current <= end) {
       addHoliday(current.toISOString().split('T')[0], description);
       current.setDate(current.getDate() + 1);
    }
  };

  // 2025
  addRange('2025-09-01', '2025-09-07', 'Yaz Tatili');
  // 29 Ekim is work day
  addRange('2025-11-10', '2025-11-14', '1. Ara Tatil');
  
  // 2026
  addHoliday('2026-01-01', 'Yılbaşı');
  addRange('2026-01-19', '2026-01-30', 'Yarıyıl Tatili (Sömestir)');
  addRange('2026-03-16', '2026-03-20', '2. Ara Tatil');
  // 23 Nisan is work day
  addHoliday('2026-05-01', 'Emek ve Dayanışma Günü');
  // 19 Mayıs is work day
  addRange('2026-05-26', '2026-05-30', 'Kurban Bayramı'); 
  addRange('2026-06-27', '2026-06-30', 'Yaz Tatili');

  return initialHolidays;
};

const App: React.FC = () => {
  // --- State with Lazy Initialization (Persistence) ---
  
  // 1. Class Name
  const [className, setClassName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('className') || '1D Sınıfı';
    }
    return '1D Sınıfı';
  });

  // 2. Students
  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('students');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 3. Holidays
  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('holidays');
      // Return saved holidays if they exist
      if (saved) {
        return JSON.parse(saved);
      }
    }
    // Otherwise return default 2025-2026 schedule
    return getDefaultHolidays();
  });
  
  // Date State
  // Default to September 2025
  const [selectedMonth, setSelectedMonth] = useState(8); 
  const [selectedYear, setSelectedYear] = useState(2025);

  // Result State
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  // --- Persistence Effects (Save on Change) ---
  useEffect(() => {
    localStorage.setItem('className', className);
  }, [className]);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('holidays', JSON.stringify(holidays));
  }, [holidays]);

  // --- Handlers ---
  const handleGenerate = () => {
    const result = generateSchedule(selectedYear, selectedMonth, students, holidays);
    setSchedule(result);
  };

  // Auto-generate if students exist on load (optional but helpful)
  useEffect(() => {
    if (students.length > 0 && schedule.length === 0) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  const years = [2024, 2025, 2026, 2027];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-4 px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                   <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Okul Nöbet Asistanı</h1>
                    <p className="text-xs text-indigo-200">2025-2026 Eğitim Öğretim Yılı</p>
                </div>
            </div>
            <div className="hidden md:flex items-center text-sm font-medium text-indigo-200">
               Versiyon 1.2
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar - Settings */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
          
          {/* Class Settings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
               <Settings className="w-5 h-5 text-gray-500" />
               <h2 className="text-lg font-semibold text-gray-800">Ayarlar</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf Adı</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Örn: 1D Sınıfı"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Yıl</label>
                   <select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                   >
                      {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Ay</label>
                   <select 
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                   >
                      {monthNames.map((name, idx) => (
                        <option key={idx} value={idx}>{name}</option>
                      ))}
                   </select>
                </div>
              </div>
              
              <button 
                onClick={handleGenerate}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 mt-4"
              >
                <RefreshCw className="w-5 h-5" />
                Listeyi Oluştur
              </button>
            </div>
          </div>

          {/* Student List Manager */}
          <div className="flex-1 min-h-[300px]">
            <StudentList students={students} setStudents={setStudents} />
          </div>

           {/* Holiday Manager */}
           <div className="flex-1 min-h-[250px]">
            <HolidayPicker holidays={holidays} setHolidays={setHolidays} />
          </div>

        </div>

        {/* Right Content - Table */}
        <div className="lg:col-span-8 h-full min-h-[600px]">
          <ScheduleTable 
            schedule={schedule} 
            className={className} 
            monthName={`${monthNames[selectedMonth]} ${selectedYear}`}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-2">
            <p className="text-sm font-medium text-gray-600">
                Mahmut İŞİyok tarafından lisanslanmıştır
            </p>
            <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} Okul Nöbet Asistanı
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;