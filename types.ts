export interface Student {
  id: string;
  name: string;
}

export interface Holiday {
  id: string;
  date: string; // ISO format YYYY-MM-DD
  description: string;
}

export interface ScheduleItem {
  date: Date;
  student1: string;
  student2: string;
  isHoliday: boolean;
  holidayName?: string;
  isWeekend: boolean;
}

export interface ClassConfig {
  className: string;
  students: Student[];
  holidays: Holiday[];
  month: number; // 0-11
  year: number;
}