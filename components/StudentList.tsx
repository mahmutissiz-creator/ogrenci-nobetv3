import React, { useState, useRef } from 'react';
import { Student } from '../types';
import { Plus, Trash2, Users, Upload, FileText, X } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  setStudents: (students: Student[]) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, setStudents }) => {
  const [newName, setNewName] = useState('');
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

  const addStudent = () => {
    if (!newName.trim()) return;
    const newStudent: Student = {
      id: generateId(),
      name: newName.trim()
    };
    setStudents([...students, newStudent]);
    setNewName('');
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addStudent();
    }
  };

  const processBulkData = (text: string) => {
    // Split by new line or comma, trim, filter empty
    const names = text.split(/[\n,]/)
      .map(n => n.trim())
      .filter(n => n.length > 0);

    if (names.length === 0) return;

    const newStudents = names.map(name => ({
      id: generateId(),
      name
    }));

    setStudents([...students, ...newStudents]);
    setBulkText('');
    setIsBulkOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processBulkData(content);
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-800">Öğrenci Listesi</h2>
        </div>
        <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
          {students.length}
        </span>
      </div>

      {!isBulkOpen ? (
        <>
          <div className="mb-4 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Öğrenci adı yazın..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={addStudent}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={() => setIsBulkOpen(true)}
              className="w-full flex items-center justify-center gap-2 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg border border-indigo-200 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Excel'den / Toplu Ekle
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 min-h-[200px] max-h-[300px] md:max-h-none">
            {students.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-sm">
                Listeniz boş.<br/>Öğrenci ekleyin veya Excel'den yapıştırın.
              </div>
            ) : (
              students.map((student, index) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg group hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400 w-5">{index + 1}</span>
                    <span className="text-gray-700 font-medium">{student.name}</span>
                  </div>
                  <button
                    onClick={() => removeStudent(student.id)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col h-full animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Toplu Ekleme</h3>
            <button onClick={() => setIsBulkOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Excel'den kopyaladığınız isim listesini buraya yapıştırın..."
            className="flex-1 w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3 resize-none"
          />
          
          <div className="flex gap-2">
             <input
              type="file"
              ref={fileInputRef}
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              Dosya Yükle
            </button>
            <button
              onClick={() => processBulkData(bulkText)}
              disabled={!bulkText.trim()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Listeyi Ekle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};