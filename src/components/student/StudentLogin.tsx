import React, { useState } from 'react';
import { ExamPackage, StudentProfile } from '../../types/cbt';
import { KeyRound, ShieldAlert, Clock, BookOpen, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface StudentLoginProps {
  exams: ExamPackage[];
  onStartExam: (student: StudentProfile, exam: ExamPackage, token: string) => void;
  onSwitchToAdmin: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({
  exams,
  onStartExam,
  onSwitchToAdmin
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [nisn, setNisn] = useState<string>('20261109');
  const [fullName, setFullName] = useState<string>('Ahmad Al-Fatih');
  const [classGroup, setClassGroup] = useState<string>('XII RPL 1');
  const [roomNumber, setRoomNumber] = useState<string>('LAB-RPL-02');
  const [tokenInput, setTokenInput] = useState<string>('');
  const [agreementChecked, setAgreementChecked] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];

  const handleFillDemoToken = () => {
    if (selectedExam) {
      setTokenInput(selectedExam.token);
      setErrorMessage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedExam) {
      setErrorMessage('Pilih paket ujian terlebih dahulu.');
      return;
    }

    if (!nisn.trim() || !fullName.trim()) {
      setErrorMessage('Nomor Peserta / NISN dan Nama Lengkap wajib diisi.');
      return;
    }

    const cleanInputToken = tokenInput.trim().toUpperCase();
    const cleanExpectedToken = selectedExam.token.trim().toUpperCase();

    if (cleanInputToken !== cleanExpectedToken) {
      setErrorMessage(`Token ujian "${tokenInput}" tidak valid untuk paket ini. Hubungi proktor atau klik "Gunakan Token Ujian".`);
      return;
    }

    if (!agreementChecked) {
      setErrorMessage('Anda harus menyetujui tata tertib ujian sebelum memulai.');
      return;
    }

    const student: StudentProfile = {
      studentId: nisn.trim(),
      fullName: fullName.trim(),
      schoolName: 'SMK Negeri 1 Rekayasa & Informatika',
      classGroup: classGroup.trim(),
      roomNumber: roomNumber.trim()
    };

    onStartExam(student, selectedExam, cleanInputToken);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            CBT
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">EduCBT Pro System</h1>
            <p className="text-xs text-slate-400">Portal Peserta Ujian Berbasis Komputer</p>
          </div>
        </div>

        <button
          onClick={onSwitchToAdmin}
          className="px-3.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-colors"
        >
          Masuk Panel Guru / Proktor
        </button>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Exam Card & Information */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/70">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Paket Ujian Aktif</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2 leading-snug">
                {selectedExam?.title}
              </h2>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                {selectedExam?.description}
              </p>

              <div className="space-y-3 pt-3 border-t border-slate-700/60 text-xs text-slate-300">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Mata Uji</span>
                  <span className="font-medium text-white">{selectedExam?.subject}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Tingkat Kelas</span>
                  <span className="font-medium text-white">{selectedExam?.gradeLevel}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Alokasi Waktu</span>
                  <span className="font-medium text-amber-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedExam?.durationMinutes} Menit
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Total Soal</span>
                  <span className="font-medium text-white">{selectedExam?.questions.length} Butir Soal</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Kriteria Kelulusan (KKM)</span>
                  <span className="font-medium text-emerald-400">{selectedExam?.passingGrade} Poin</span>
                </div>
              </div>
            </div>

            {/* Anti-Cheat Rules Box */}
            <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <ShieldAlert className="w-4 h-4" />
                <span>Sistem Integritas & Anti-Curang</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                <li>Ujian wajib dikerjakan dalam mode <strong>Layar Penuh (Fullscreen)</strong>.</li>
                <li>Dilarang berpindah tab browser atau membuka aplikasi lain.</li>
                <li>Setiap aksi keluar tab tercatat dan dapat mengunci lembar ujian.</li>
                <li>Jawaban tersimpan otomatis secara real-time ke sistem.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Login Form & Token Entry */}
          <div className="md:col-span-7 bg-slate-800/90 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Konfirmasi Identitas & Token</h3>
            <p className="text-xs text-slate-400 mb-6">Pastikan data peserta sesuai dengan kartu login ujian Anda.</p>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pilih Paket Ujian
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => {
                    setSelectedExamId(e.target.value);
                    setTokenInput('');
                    setErrorMessage(null);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title} ({exam.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nomor Peserta / NISN
                  </label>
                  <input
                    type="text"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    placeholder="Contoh: 20261109"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Kelas / Rombel
                  </label>
                  <input
                    type="text"
                    value={classGroup}
                    onChange={(e) => setClassGroup(e.target.value)}
                    placeholder="XII RPL 1"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nama Lengkap Peserta
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama lengkap siswa"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Ruang Ujian / Lab
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="LAB-01"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Token Input Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Masukkan Token Ujian (6 Karakter)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleFillDemoToken}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Pakai Token Demo ({selectedExam?.token})</span>
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={10}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                  placeholder="Ketik token di sini..."
                  className="w-full bg-slate-950 border border-amber-600/50 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest text-amber-300 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700/60 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-800"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  Saya menyatakan mengerjakan ujian ini dengan jujur, mandiri tanpa bantuan AI / orang lain, dan bersedia mematuhi tata tertib pengawasan CBT.
                </span>
              </label>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mulai Kerjakan Ujian Sekarang</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-800 text-center text-xs text-slate-400">
        EduCBT Pro 2026 · Standardized Computer-Based Test Engine for SMK & High School
      </footer>
    </div>
  );
};
