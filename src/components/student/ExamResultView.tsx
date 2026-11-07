import React, { useState } from 'react';
import { ExamPackage, ExamSessionState, SchoolSettings } from '../../types/cbt';
import { CodeViewer } from '../common/CodeViewer';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ExamResultViewProps {
  session: ExamSessionState;
  exam: ExamPackage;
  settings: SchoolSettings;
  onRetakeOrExit: () => void;
  onGoToAdmin: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  session,
  exam,
  settings,
  onRetakeOrExit,
  onGoToAdmin
}) => {
  const [expandedExplanation, setExpandedExplanation] = useState<Record<string, boolean>>({});

  const score = session.calculatedScore || {
    totalPointsEarned: 0,
    maxPointsPossible: 100,
    finalPercentage: 0,
    passed: false,
    correctCount: 0,
    wrongCount: 0,
    unansweredCount: 0
  };

  const toggleExplanation = (questionId: string) => {
    setExpandedExplanation(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-10 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-6">
        {/* Navigation & Action Bar (Hidden in Print) */}
        <div className="flex items-center justify-between no-print pb-2">
          <button
            onClick={onRetakeOrExit}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Kembali ke Halaman Utama</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Lembar Nilai</span>
            </button>
            <button
              onClick={onGoToAdmin}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-md shadow-indigo-600/20"
            >
              <span>Portal Guru / Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Printable Report Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Top School Header */}
          <div className="border-b border-slate-800 pb-6 text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
              {settings.schoolName}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-indigo-400 tracking-wider uppercase">
              {settings.examHeaderTitle}
            </p>
            <p className="text-xs text-slate-400">
              Tahun Ajaran: {settings.academicYear} · {settings.curriculum}
            </p>
          </div>

          {/* Student & Exam Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Nomor Peserta (NISN)</span>
              <span className="font-mono font-bold text-white text-sm">{session.student.studentId}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Nama Peserta</span>
              <span className="font-bold text-white text-sm">{session.student.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Kelas & Ruang</span>
              <span className="font-medium text-white text-sm">
                {session.student.classGroup} / {session.student.roomNumber || 'LAB-01'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Mata Uji</span>
              <span className="font-medium text-indigo-300 text-sm">{exam.subject}</span>
            </div>
          </div>

          {/* Score Hero Section */}
          <div className="my-8 p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border ${
                  score.passed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                <Trophy className="w-10 h-10" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      score.passed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {score.passed ? 'Lulus Kompeten' : 'Belum Memenuhi KKM'}
                  </span>
                  <span className="text-xs text-slate-400">
                    Standar KKM: <strong className="text-white font-mono">{exam.passingGrade}</strong>
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Skor Akhir: {score.finalPercentage}{' '}
                  <span className="text-sm font-normal text-slate-400">/ 100</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Total poin yang diperoleh: {score.totalPointsEarned} dari {score.maxPointsPossible} poin maksimal
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 w-full md:w-auto text-center text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl min-w-[85px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="block font-bold font-mono text-emerald-400 text-base">
                  {score.correctCount}
                </span>
                <span className="text-[11px] text-slate-400">Benar</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl min-w-[85px]">
                <XCircle className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                <span className="block font-bold font-mono text-rose-400 text-base">
                  {score.wrongCount}
                </span>
                <span className="text-[11px] text-slate-400">Salah</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl min-w-[85px]">
                <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                <span className="block font-bold font-mono text-slate-300 text-base">
                  {session.violations.length}
                </span>
                <span className="text-[11px] text-slate-400">Pelanggaran</span>
              </div>
            </div>
          </div>

          {/* Detailed Question Review & Discussion (Pembahasan Soal) */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Analisis Butir Soal & Pembahasan Kunci Jawaban</span>
              </h3>
              <span className="text-xs text-slate-400">
                {exam.questions.length} Butir Soal
              </span>
            </div>

            {exam.questions.map((q, idx) => {
              const studentAnswer = session.answers[q.id];
              const isFlagged = session.flaggedQuestions[q.id];
              let isCorrect = false;

              if (q.type === 'single_choice' || q.type === 'true_false') {
                isCorrect = studentAnswer === q.correctAnswer;
              } else if (q.type === 'multiple_choice') {
                const cArr = Array.isArray(q.correctAnswer) ? [...q.correctAnswer].sort() : [q.correctAnswer];
                const sArr = Array.isArray(studentAnswer) ? [...studentAnswer].sort() : [studentAnswer];
                isCorrect = JSON.stringify(cArr) === JSON.stringify(sArr);
              } else {
                isCorrect = typeof studentAnswer === 'string' && studentAnswer.length >= 10;
              }

              const isExpanded = expandedExplanation[q.id];

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      : 'bg-rose-950/10 border-rose-900/30 hover:border-rose-800/50'
                  } p-5`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-xs font-semibold text-slate-300">
                        {q.category} · {q.points} Poin
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isFlagged && (
                        <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 text-[10px] font-semibold">
                          Ragu-ragu
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                          isCorrect
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                        }`}
                      >
                        {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{isCorrect ? 'Benar' : 'Salah'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Question text */}
                  <p className="text-sm text-slate-200 leading-relaxed mb-3">
                    {q.questionText}
                  </p>

                  {/* Code snippet if any */}
                  {q.codeSnippet && (
                    <CodeViewer
                      code={q.codeSnippet.code}
                      language={q.codeSnippet.language}
                    />
                  )}

                  {/* Comparison: Jawaban Anda vs Kunci Jawaban */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 mb-3">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Jawaban Anda:</span>
                      <span className={`font-mono font-semibold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {Array.isArray(studentAnswer)
                          ? studentAnswer.join(', ') || '(Tidak dijawab)'
                          : studentAnswer || '(Tidak dijawab)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Kunci Jawaban Resmi:</span>
                      <span className="font-mono font-semibold text-indigo-300">
                        {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                      </span>
                    </div>
                  </div>

                  {/* Explanation Toggle */}
                  <button
                    onClick={() => toggleExplanation(q.id)}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  >
                    <span>{isExpanded ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan Lengkap'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Expanded Explanation Box */}
                  {isExpanded && (
                    <div className="mt-3 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200/90 leading-relaxed">
                      <strong className="block text-indigo-300 mb-1 font-semibold">
                        Penjelasan Pedagogis:
                      </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Official Signatures for Printing */}
          <div className="mt-12 pt-8 border-t border-slate-800 hidden print:grid grid-cols-2 text-center text-xs text-slate-800">
            <div>
              <p>Mengetahui,</p>
              <p className="font-semibold">Kepala Sekolah</p>
              <div className="h-16" />
              <p className="font-bold underline">{settings.principalName}</p>
            </div>
            <div>
              <p>Proktor Utama,</p>
              <p className="font-semibold">Koordinator CBT</p>
              <div className="h-16" />
              <p className="font-bold underline">{settings.chiefProctorName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
