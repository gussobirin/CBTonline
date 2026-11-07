import React, { useState } from 'react';
import { ProctorStudentStatus, ExamPackage } from '../../types/cbt';
import { mockProctorStudents } from '../../data/initialExams';
import {
  Users,
  Search,
  ShieldAlert,
  Unlock,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock,
  Send,
  MessageSquare,
  Sparkles,
  Camera
} from 'lucide-react';

interface LiveProctorViewProps {
  exams: ExamPackage[];
}

export const LiveProctorView: React.FC<LiveProctorViewProps> = ({ exams }) => {
  const [students, setStudents] = useState<ProctorStudentStatus[]>(mockProctorStudents);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUnlockStudent = (id: string, name: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'Mengerjakan', violationCount: Math.max(0, s.violationCount - 1) } : s))
    );
    showToast(`Lembar ujian ${name} berhasil dibuka kuncinya.`);
  };

  const handleSendWarning = (name: string) => {
    showToast(`Peringatan resmi pengawas dikirim ke layar ${name}.`);
  };

  const handleAddExtraTime = (id: string, name: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, remainingMinutes: s.remainingMinutes + 10 } : s))
    );
    showToast(`Tambahan waktu +10 menit diberikan kepada ${name}.`);
  };

  const handleForceSubmit = (id: string, name: string) => {
    if (confirm(`Paksa kumpulkan ujian untuk siswa ${name}?`)) {
      setStudents(prev =>
        prev.map(s => (s.id === id ? { ...s, status: 'Selesai', remainingMinutes: 0 } : s))
      );
      showToast(`Jawaban ${name} berhasil dipaksa kumpulkan ke server.`);
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    showToast(`Pengumuman proktor berhasil disiarkan ke semua layar peserta!`);
    setBroadcastMessage('');
  };

  const handleUnlockAll = () => {
    setStudents(prev =>
      prev.map(s => (s.status === 'Terkunci' ? { ...s, status: 'Mengerjakan' } : s))
    );
    showToast('Seluruh workstation yang terkunci telah dibuka.');
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesFilter = filterStatus === 'all' || s.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.includes(searchQuery) ||
      s.classGroup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCount = students.filter(s => s.status === 'Mengerjakan').length;
  const lockedCount = students.filter(s => s.status === 'Terkunci').length;
  const finishedCount = students.filter(s => s.status === 'Selesai').length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 p-3 px-4 bg-emerald-600 text-white rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Proctor Room Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-white block">{students.length}</span>
            <span className="text-xs text-slate-400">Total Peserta Ruang</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-emerald-400 block">{activeCount}</span>
            <span className="text-xs text-slate-400">Sedang Mengerjakan</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-rose-400 block">{lockedCount}</span>
            <span className="text-xs text-slate-400">Terkunci (Pelanggaran)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-blue-400 block">{finishedCount}</span>
            <span className="text-xs text-slate-400">Telah Mengumpulkan</span>
          </div>
        </div>
      </div>

      {/* Broadcast Message to Candidates */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <form onSubmit={handleBroadcast} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold shrink-0">
            <MessageSquare className="w-4 h-4" />
            <span>Siarkan Pesan Pengawas:</span>
          </div>
          <input
            type="text"
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            placeholder="Ketik pengumuman proktor (cth: Sisa waktu 15 menit, periksa kembali soal ragu-ragu)..."
            className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Pesan</span>
          </button>
        </form>
      </div>

      {/* Control Strip & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa atau NISN..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterStatus === 'all' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Semua ({students.length})
            </button>
            <button
              onClick={() => setFilterStatus('Mengerjakan')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterStatus === 'Mengerjakan' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Mengerjakan ({activeCount})
            </button>
            <button
              onClick={() => setFilterStatus('Terkunci')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterStatus === 'Terkunci' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Terkunci ({lockedCount})
            </button>
            <button
              onClick={() => setFilterStatus('Selesai')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterStatus === 'Selesai' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Selesai ({finishedCount})
            </button>
          </div>

          {lockedCount > 0 && (
            <button
              onClick={handleUnlockAll}
              className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Buka Semua Kunci</span>
            </button>
          )}
        </div>
      </div>

      {/* Student Workstations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStudents.map((std) => {
          const progressPercent = Math.round((std.progressAnswered / std.totalQuestions) * 100);

          return (
            <div
              key={std.id}
              className={`rounded-2xl border p-5 transition-all ${
                std.status === 'Terkunci'
                  ? 'bg-rose-950/20 border-rose-500/60 shadow-lg shadow-rose-950/30'
                  : std.status === 'Selesai'
                  ? 'bg-slate-900 border-slate-800 opacity-90'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header: Student Name & Status */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{std.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    NISN: {std.studentId} · {std.classGroup}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    std.status === 'Mengerjakan'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : std.status === 'Terkunci'
                      ? 'bg-rose-950 text-rose-300 border border-rose-600 animate-pulse'
                      : 'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}
                >
                  {std.status === 'Terkunci' && <Lock className="w-3 h-3" />}
                  {std.status === 'Mengerjakan' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  <span>{std.status}</span>
                </span>
              </div>

              {/* Progress & Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>
                    Progres:{' '}
                    <strong className="text-white font-mono">
                      {std.progressAnswered}/{std.totalQuestions} Soal
                    </strong>
                  </span>
                  <span className="font-mono text-indigo-400 font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      std.status === 'Terkunci'
                        ? 'bg-rose-500'
                        : std.status === 'Selesai'
                        ? 'bg-blue-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Badges strip: Violations, Remaining time, Flagged */}
              <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-slate-800/80 text-[11px] text-slate-400 mb-4">
                <div>
                  <span className="block text-[10px] text-slate-500">Sisa Waktu</span>
                  <span className="font-mono text-white font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {std.remainingMinutes} Menit
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-500">Ragu-ragu</span>
                  <span className="font-mono text-amber-300 font-semibold">{std.flaggedCount} Soal</span>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-500">Pelanggaran Tab</span>
                  <span
                    className={`font-mono font-bold ${
                      std.violationCount > 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {std.violationCount}x
                  </span>
                </div>
              </div>

              {/* Action Buttons for Proctor */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {std.status === 'Terkunci' ? (
                  <button
                    onClick={() => handleUnlockStudent(std.id, std.name)}
                    className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Buka Kunci Layar</span>
                  </button>
                ) : std.status === 'Mengerjakan' ? (
                  <>
                    <button
                      onClick={() => handleSendWarning(std.name)}
                      className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors"
                      title="Kirim pesan peringatan"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>Peringatkan</span>
                    </button>
                    <button
                      onClick={() => handleAddExtraTime(std.id, std.name)}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors"
                      title="Tambah 10 menit"
                    >
                      <span>+10m</span>
                    </button>
                    <button
                      onClick={() => handleForceSubmit(std.id, std.name)}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 rounded-lg font-medium transition-colors"
                      title="Paksa Kumpulkan"
                    >
                      <span>Kumpulkan</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center py-1 text-slate-400 text-xs">
                    Selesai (Skor: <strong className="text-white font-mono">{std.score ?? 85}</strong>)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
