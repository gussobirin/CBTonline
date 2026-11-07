import React, { useState } from 'react';
import { ExamPackage, Question } from '../../types/cbt';
import { QuestionEditorModal } from './QuestionEditorModal';
import {
  Plus,
  BookOpen,
  Clock,
  KeyRound,
  Trash2,
  Edit,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Shield
} from 'lucide-react';
import { sampleExams } from '../../data/initialExams';

interface ExamPackageManagerProps {
  exams: ExamPackage[];
  onUpdateExams: (exams: ExamPackage[]) => void;
}

export const ExamPackageManager: React.FC<ExamPackageManagerProps> = ({
  exams,
  onUpdateExams
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateNewPackage = () => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randToken = '';
    for (let i = 0; i < 6; i++) {
      randToken += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    const newPkg: ExamPackage = {
      id: 'pkg-' + Date.now(),
      title: 'Ujian Baru (Klik untuk sunting)',
      subject: 'Informatika & Pemrograman',
      gradeLevel: 'Kelas XII',
      description: 'Deskripsi paket ujian dan petunjuk umum pengerjaan.',
      durationMinutes: 60,
      token: randToken,
      tokenActive: true,
      passingGrade: 75,
      randomizeQuestions: false,
      randomizeChoices: false,
      allowReview: true,
      showScoreImmediately: true,
      strictFullscreen: true,
      maxViolations: 3,
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: 'q-' + Date.now(),
          type: 'single_choice',
          category: 'Dasar Pemrograman',
          questionText: 'Manakah di bawah ini yang merupakan tipe data primitif dalam bahasa JavaScript?',
          options: [
            { id: 'A', text: 'String, Number, Boolean' },
            { id: 'B', text: 'Array, Object, Function' },
            { id: 'C', text: 'Class, Interface, Struct' },
            { id: 'D', text: 'Vector, Tuple, Pointer' }
          ],
          correctAnswer: 'A',
          points: 10,
          difficulty: 'Mudah',
          explanation: 'JavaScript memiliki tipe data primitif seperti string, number, bigint, boolean, undefined, symbol, dan null.'
        }
      ]
    };

    const updated = [newPkg, ...exams];
    onUpdateExams(updated);
    setSelectedExamId(newPkg.id);
    showNotice('Paket ujian baru berhasil dibuat!');
  };

  const handleDeletePackage = (id: string) => {
    if (exams.length <= 1) {
      alert('Minimal harus ada satu paket ujian tersimpan di sistem.');
      return;
    }
    if (confirm('Apakah Anda yakin ingin menghapus paket ujian ini?')) {
      const updated = exams.filter(e => e.id !== id);
      onUpdateExams(updated);
      setSelectedExamId(updated[0]?.id || '');
      showNotice('Paket ujian berhasil dihapus.');
    }
  };

  const handleUpdateCurrentPackageField = <K extends keyof ExamPackage>(field: K, val: ExamPackage[K]) => {
    if (!selectedExam) return;
    const updatedExam = { ...selectedExam, [field]: val };
    const updated = exams.map(e => e.id === selectedExam.id ? updatedExam : e);
    onUpdateExams(updated);
  };

  const handleRegenerateToken = () => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randToken = '';
    for (let i = 0; i < 6; i++) {
      randToken += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    handleUpdateCurrentPackageField('token', randToken);
    showNotice(`Token ujian diperbarui menjadi: ${randToken}`);
  };

  // Question actions
  const handleSaveQuestion = (savedQ: Question) => {
    if (!selectedExam) return;
    const exists = selectedExam.questions.some(q => q.id === savedQ.id);
    let updatedQuestions: Question[] = [];

    if (exists) {
      updatedQuestions = selectedExam.questions.map(q => q.id === savedQ.id ? savedQ : q);
      showNotice('Butir soal berhasil diperbarui!');
    } else {
      updatedQuestions = [...selectedExam.questions, savedQ];
      showNotice('Butir soal baru berhasil ditambahkan!');
    }

    handleUpdateCurrentPackageField('questions', updatedQuestions);
    setIsQuestionModalOpen(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedExam) return;
    if (selectedExam.questions.length <= 1) {
      alert('Paket ujian harus memiliki minimal 1 butir soal.');
      return;
    }
    if (confirm('Hapus butir soal ini?')) {
      const updatedQuestions = selectedExam.questions.filter(q => q.id !== questionId);
      handleUpdateCurrentPackageField('questions', updatedQuestions);
      showNotice('Butir soal berhasil dihapus.');
    }
  };

  // Export & Import
  const handleExportJSON = () => {
    if (!selectedExam) return;
    const blob = new Blob([JSON.stringify(selectedExam, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Paket_CBT_${selectedExam.title.replace(/\s+/g, '_')}_2026.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Paket ujian diekspor ke file JSON.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.id && parsed.title && Array.isArray(parsed.questions)) {
          parsed.id = 'imported-' + Date.now();
          const updated = [parsed, ...exams];
          onUpdateExams(updated);
          setSelectedExamId(parsed.id);
          showNotice('Paket ujian JSON berhasil diimpor!');
        } else {
          alert('Format berkas JSON tidak sesuai struktur paket CBT.');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON. Pastikan format valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetToSamples = () => {
    if (confirm('Kembalikan semua bank soal ke data paket standar (UKK RPL 2026 & ANBK)?')) {
      onUpdateExams(sampleExams);
      setSelectedExamId(sampleExams[0].id);
      showNotice('Bank soal dikembalikan ke paket kejuruan standar.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 p-3 px-4 bg-emerald-600 text-white rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-white">Manajemen Bank Soal & Paket Ujian</h2>
            <p className="text-xs text-slate-400">Buat, impor, kelola token, dan konfigurasi butir soal CBT</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5"
            title="Download JSON Paket Soal"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor JSON</span>
          </button>

          <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Impor JSON</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={handleResetToSamples}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5"
            title="Reset ke paket standar UKK RPL"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Paket Standar</span>
          </button>

          <button
            onClick={handleCreateNewPackage}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Paket Ujian Baru</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Exam Package Selector & Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Packages */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Daftar Paket Ujian ({exams.length})
          </h3>
          {exams.map((pkg) => {
            const isSelected = pkg.id === selectedExamId;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedExamId(pkg.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                    {pkg.title}
                  </h4>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                </div>
                <p className="text-xs text-indigo-300 font-medium mb-3">{pkg.subject}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {pkg.durationMinutes}m
                  </span>
                  <span>{pkg.questions.length} Butir Soal</span>
                  <span className="font-mono bg-amber-950/70 border border-amber-800/60 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                    {pkg.token}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Package Configuration & Questions */}
        {selectedExam && (
          <div className="lg:col-span-8 space-y-6">
            {/* Package Metadata Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Konfigurasi Parameter Ujian</h3>
                  <p className="text-xs text-slate-400">Atur durasi, token rilis, dan standar kelulusan</p>
                </div>
                <button
                  onClick={() => handleDeletePackage(selectedExam.id)}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg text-xs flex items-center gap-1.5 border border-rose-900/40"
                  title="Hapus paket ujian"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Paket</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Judul Ujian</label>
                  <input
                    type="text"
                    value={selectedExam.title}
                    onChange={(e) => handleUpdateCurrentPackageField('title', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Mata Pelajaran / Kompetensi</label>
                  <input
                    type="text"
                    value={selectedExam.subject}
                    onChange={(e) => handleUpdateCurrentPackageField('subject', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Durasi (Menit)</label>
                  <input
                    type="number"
                    min={5}
                    max={240}
                    value={selectedExam.durationMinutes}
                    onChange={(e) => handleUpdateCurrentPackageField('durationMinutes', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">KKM Kelulusan</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={selectedExam.passingGrade}
                    onChange={(e) => handleUpdateCurrentPackageField('passingGrade', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Toleransi Keluar Tab</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={selectedExam.maxViolations}
                    onChange={(e) => handleUpdateCurrentPackageField('maxViolations', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Token Ujian Aktif</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={selectedExam.token}
                      onChange={(e) => handleUpdateCurrentPackageField('token', e.target.value.toUpperCase())}
                      className="w-full bg-slate-950 border border-amber-600/50 rounded-lg p-2 text-center text-amber-300 font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleRegenerateToken}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                      title="Acak Token Baru"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={selectedExam.strictFullscreen}
                    onChange={(e) => handleUpdateCurrentPackageField('strictFullscreen', e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-700"
                  />
                  <span>Wajib Layar Penuh (Strict Fullscreen)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={selectedExam.showScoreImmediately}
                    onChange={(e) => handleUpdateCurrentPackageField('showScoreImmediately', e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-700"
                  />
                  <span>Tampilkan Skor Langsung setelah Selesai</span>
                </label>
              </div>
            </div>

            {/* Questions List for this Package */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Butir Soal ({selectedExam.questions.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Total bobot nilai:{' '}
                    <strong className="text-indigo-400">
                      {selectedExam.questions.reduce((acc, q) => acc + q.points, 0)} Poin
                    </strong>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsQuestionModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Soal</span>
                </button>
              </div>

              <div className="space-y-3">
                {selectedExam.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-6 h-6 rounded bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-[11px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-300">{q.category}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-indigo-400 font-mono">{q.points} Poin</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400 uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-800">
                          {q.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                        {q.questionText}
                      </p>
                      {q.codeSnippet && (
                        <span className="inline-block text-[11px] font-mono text-amber-300 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-800/40">
                          KODE: {q.codeSnippet.language}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingQuestion(q);
                          setIsQuestionModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg text-xs border border-slate-700"
                        title="Sunting Soal"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs border border-slate-700"
                        title="Hapus Soal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Question Editor Modal */}
      <QuestionEditorModal
        isOpen={isQuestionModalOpen}
        question={editingQuestion}
        onSave={handleSaveQuestion}
        onClose={() => {
          setIsQuestionModalOpen(false);
          setEditingQuestion(null);
        }}
      />
    </div>
  );
};
