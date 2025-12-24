import { Student, Holiday, ScheduleItem } from "../types";

export const generateSchedule = (
  year: number,
  month: number,
  students: Student[],
  holidays: Holiday[]
): ScheduleItem[] => {
  const schedule: ScheduleItem[] = [];
  
  if (students.length === 0) return [];

  // Get total days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create a map for quick holiday lookup
  const holidayMap = new Map<string, string>();
  holidays.forEach(h => holidayMap.set(h.date, h.description));

  let studentIndex = 0;
  
  // Helper to get next student
  const getNextStudent = () => {
    const s = students[studentIndex % students.length];
    studentIndex++;
    return s.name;
  };

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Format YYYY-MM-DD using local time components to match holiday strings
    // Using toISOString() directly on a local Date object causes timezone shifts
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;
    
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidayMap.has(dateKey);
    const holidayName = holidayMap.get(dateKey);

    const item: ScheduleItem = {
      date: currentDate,
      student1: "",
      student2: "",
      isWeekend,
      isHoliday: !!isHoliday,
      holidayName
    };

    if (!isWeekend && !isHoliday) {
      item.student1 = getNextStudent();
      item.student2 = getNextStudent();
    }

    schedule.push(item);
  }

  return schedule;
};