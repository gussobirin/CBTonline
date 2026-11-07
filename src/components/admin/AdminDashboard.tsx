import React, { useState } from 'react';
import { ExamPackage, ExamSessionState, SchoolSettings } from '../../types/cbt';
import { ExamPackageManager } from './ExamPackageManager';
import { LiveProctorView } from './LiveProctorView';
import { AnalyticsView } from './AnalyticsView';
import { SettingsView } from './SettingsView';
import {
  Activity,
  BookOpen,
  BarChart3,
  Settings,
  Sparkles,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  exams: ExamPackage[];
  settings: SchoolSettings;
  completedResults: ExamSessionState[];
  onUpdateExams: (exams: ExamPackage[]) => void;
  onUpdateSettings: (settings: SchoolSettings) => void;
  onViewStudentResult: (session: ExamSessionState) => void;
  onSwitchToStudent: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  exams,
  settings,
  completedResults,
  onUpdateExams,
  onUpdateSettings,
  onViewStudentResult,
  onSwitchToStudent
}) => {
  const [activeTab, setActiveTab] = useState<'proctor' | 'exams' | 'analytics' | 'settings'>('proctor');

  const totalQuestions = exams.reduce((acc, e) => acc + e.questions.length, 0);
  const activeExam = exams[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-6 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
              CBT
            </div>
            <div>
              <span className="text-base font-extrabold text-white tracking-tight">EduCBT Pro Console</span>
              <span className="hidden sm:inline-block text-slate-400 text-xs ml-2">· Panel Guru & Proktor</span>
            </div>
          </div>

          {/* Zone 2: Navigation Links / Tab Items */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setActiveTab('proctor')}
              className={`flex items-center gap-1.5 py-1 transition-colors ${
                activeTab === 'proctor' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Monitoring Ruang Ujian</span>
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`flex items-center gap-1.5 py-1 transition-colors ${
                activeTab === 'exams' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bank Soal & Paket</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 py-1 transition-colors ${
                activeTab === 'analytics' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analisis & Rekap Nilai</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 py-1 transition-colors ${
                activeTab === 'settings' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Pengaturan CBT</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onSwitchToStudent}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Buka Mode Siswa (Mulai Ujian)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-b border-slate-800 p-2 text-xs">
        <button
          onClick={() => setActiveTab('proctor')}
          className={`px-3 py-1.5 rounded-lg ${activeTab === 'proctor' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Monitoring
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-3 py-1.5 rounded-lg ${activeTab === 'exams' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Bank Soal
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1.5 rounded-lg ${activeTab === 'analytics' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Nilai
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-1.5 rounded-lg ${activeTab === 'settings' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Setelan
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {/* Render Active Sub-View */}
        {activeTab === 'proctor' && <LiveProctorView exams={exams} />}
        {activeTab === 'exams' && (
          <ExamPackageManager exams={exams} onUpdateExams={onUpdateExams} />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsView
            exams={exams}
            completedResults={completedResults}
            onViewStudentResult={onViewStudentResult}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsView settings={settings} onSaveSettings={onUpdateSettings} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>EduCBT Pro · Sistem Ujian Berbasis Komputer & Bank Soal Kejuruan</span>
          <span className="font-mono text-slate-400">
            Proktor Aktif: {settings.chiefProctorName} · {settings.schoolName}
          </span>
        </div>
      </footer>
    </div>
  );
};
