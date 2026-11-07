import React, { useState } from 'react';
import { ExamPackage, ExamSessionState } from '../../types/cbt';
import {
  BarChart3,
  Download,
  CheckCircle2,
  XCircle,
  Trophy,
  Users,
  Search,
  FileSpreadsheet,
  TrendingUp,
  Percent
} from 'lucide-react';

interface AnalyticsViewProps {
  exams: ExamPackage[];
  completedResults: ExamSessionState[];
  onViewStudentResult: (session: ExamSessionState) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  exams,
  completedResults,
  onViewStudentResult
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Combine real completed results with some seeded past records if empty
  const defaultSeeds: ExamSessionState[] = [
    {
      examId: 'ukk-rpl-2026',
      student: {
        studentId: '20261104',
        fullName: 'Siti Nurhaliza',
        schoolName: 'SMK Negeri 1 Rekayasa & Informatika',
        classGroup: 'XII RPL 2',
        roomNumber: 'LAB-01'
      },
      startedAt: '2026-03-01T08:00:00Z',
      submittedAt: '2026-03-01T08:35:00Z',
      durationMinutes: 45,
      remainingSeconds: 600,
      answers: {},
      flaggedQuestions: {},
      isSubmitted: true,
      isLocked: false,
      violations: [],
      calculatedScore: {
        totalPointsEarned: 95,
        maxPointsPossible: 100,
        finalPercentage: 95,
        passed: true,
        correctCount: 7,
        wrongCount: 1,
        unansweredCount: 0
      }
    },
    {
      examId: 'ukk-rpl-2026',
      student: {
        studentId: '20261108',
        fullName: 'Gilang Pratama',
        schoolName: 'SMK Negeri 1 Rekayasa & Informatika',
        classGroup: 'XII RPL 1',
        roomNumber: 'LAB-02'
      },
      startedAt: '2026-03-01T08:00:00Z',
      submittedAt: '2026-03-01T08:42:00Z',
      durationMinutes: 45,
      remainingSeconds: 180,
      answers: {},
      flaggedQuestions: {},
      isSubmitted: true,
      isLocked: false,
      violations: [
        {
          id: 'v1',
          timestamp: '08:20:12',
          type: 'tab_switch',
          message: 'Berpindah tab'
        }
      ],
      calculatedScore: {
        totalPointsEarned: 80,
        maxPointsPossible: 100,
        finalPercentage: 80,
        passed: true,
        correctCount: 6,
        wrongCount: 2,
        unansweredCount: 0
      }
    },
    {
      examId: 'ukk-rpl-2026',
      student: {
        studentId: '20261112',
        fullName: 'Farhan Maulana',
        schoolName: 'SMK Negeri 1 Rekayasa & Informatika',
        classGroup: 'XII RPL 1',
        roomNumber: 'LAB-01'
      },
      startedAt: '2026-03-01T08:00:00Z',
      submittedAt: '2026-03-01T08:44:00Z',
      durationMinutes: 45,
      remainingSeconds: 60,
      answers: {},
      flaggedQuestions: {},
      isSubmitted: true,
      isLocked: false,
      violations: [],
      calculatedScore: {
        totalPointsEarned: 65,
        maxPointsPossible: 100,
        finalPercentage: 65,
        passed: false,
        correctCount: 4,
        wrongCount: 4,
        unansweredCount: 0
      }
    }
  ];

  const allRecords = completedResults.length > 0 ? completedResults : defaultSeeds;

  const filteredRecords = allRecords.filter(r => {
    const matchesExam = selectedExamId === 'all' || r.examId === selectedExamId;
    const matchesSearch =
      r.student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.student.studentId.includes(searchQuery) ||
      r.student.classGroup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesExam && matchesSearch;
  });

  // Calculate stats
  const totalSubmissions = filteredRecords.length;
  const scores = filteredRecords.map(r => r.calculatedScore?.finalPercentage || 0);
  const averageScore = totalSubmissions > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / totalSubmissions) : 0;
  const highestScore = totalSubmissions > 0 ? Math.max(...scores) : 0;
  const lowestScore = totalSubmissions > 0 ? Math.min(...scores) : 0;
  const passedCount = filteredRecords.filter(r => r.calculatedScore?.passed).length;
  const passRate = totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0;

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['No', 'NISN', 'Nama Peserta', 'Kelas', 'Paket Ujian', 'Skor Akhir', 'Status', 'Benar', 'Salah', 'Pelanggaran Tab'];
    const rows = filteredRecords.map((r, idx) => [
      idx + 1,
      `'${r.student.studentId}`,
      `"${r.student.fullName}"`,
      `"${r.student.classGroup}"`,
      `"${r.examId}"`,
      r.calculatedScore?.finalPercentage ?? 0,
      r.calculatedScore?.passed ? 'LULUS' : 'REMEDIAL',
      r.calculatedScore?.correctCount ?? 0,
      r.calculatedScore?.wrongCount ?? 0,
      r.violations.length
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_CBT_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-white block">{totalSubmissions}</span>
            <span className="text-xs text-slate-400">Total Berkas Nilai</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-white block">{averageScore}</span>
            <span className="text-xs text-slate-400">Rata-Rata Nilai</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-emerald-400 block">{passRate}%</span>
            <span className="text-xs text-slate-400">Tingkat Kelulusan</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-amber-300 block">
              {highestScore} <span className="text-xs text-slate-400 font-normal">/ {lowestScore}</span>
            </span>
            <span className="text-xs text-slate-400">Tertinggi / Terendah</span>
          </div>
        </div>
      </div>

      {/* Control Strip & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa, NISN, atau kelas..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="all">Semua Paket Ujian</option>
            {exams.map(e => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Ekspor Rekap Excel / CSV</span>
        </button>
      </div>

      {/* Table of Submissions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Daftar Hasil Ujian Siswa ({filteredRecords.length})</h3>
          <span className="text-xs text-slate-400">Data terurut berdasarkan waktu pengumpulan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Nama Siswa & NISN</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4 text-center">Skor Akhir</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Benar / Salah</th>
                <th className="py-3 px-4 text-center">Pelanggaran Tab</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRecords.map((r, idx) => {
                const passed = r.calculatedScore?.passed;
                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{r.student.fullName}</span>
                      <span className="text-[11px] font-mono text-slate-400">NISN: {r.student.studentId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{r.student.classGroup}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-base text-white">
                      {r.calculatedScore?.finalPercentage ?? 0}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          passed
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {passed ? 'LULUS' : 'REMEDIAL'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                      <span className="text-emerald-400 font-semibold">{r.calculatedScore?.correctCount ?? 0}</span>
                      <span className="text-slate-500"> / </span>
                      <span className="text-rose-400 font-semibold">{r.calculatedScore?.wrongCount ?? 0}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span
                        className={`font-semibold ${
                          r.violations.length > 0 ? 'text-rose-400' : 'text-slate-400'
                        }`}
                      >
                        {r.violations.length}x
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onViewStudentResult(r)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 rounded-lg border border-slate-700 font-medium text-[11px] transition-colors"
                      >
                        Lihat Rincian
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
