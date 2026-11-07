import React, { useState } from 'react';
import { Question } from '../../types/cbt';
import { AlertTriangle, CheckCircle2, HelpCircle, CircleSlash, X } from 'lucide-react';

interface ExamSummaryModalProps {
  isOpen: boolean;
  questions: Question[];
  answers: Record<string, string | string[]>;
  flagged: Record<string, boolean>;
  onClose: () => void;
  onConfirmFinish: () => void;
}

export const ExamSummaryModal: React.FC<ExamSummaryModalProps> = ({
  isOpen,
  questions,
  answers,
  flagged,
  onClose,
  onConfirmFinish
}) => {
  const [confirmChecked, setConfirmChecked] = useState(false);

  if (!isOpen) return null;

  const answeredCount = questions.filter(q => {
    const ans = answers[q.id];
    if (Array.isArray(ans)) return ans.length > 0;
    return typeof ans === 'string' && ans.trim().length > 0;
  }).length;

  const flaggedCount = questions.filter(q => flagged[q.id]).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Konfirmasi Selesai Ujian</h3>
              <p className="text-xs text-slate-400">Pastikan seluruh jawaban Anda telah diperiksa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-xl font-bold font-mono text-emerald-400">{answeredCount}</span>
            <span className="block text-[11px] text-slate-400">Sudah Dijawab</span>
          </div>

          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-center">
            <HelpCircle className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <span className="text-xl font-bold font-mono text-amber-400">{flaggedCount}</span>
            <span className="block text-[11px] text-slate-400">Masih Ragu</span>
          </div>

          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-center">
            <CircleSlash className="w-5 h-5 text-rose-400 mx-auto mb-1" />
            <span className="text-xl font-bold font-mono text-rose-400">{unansweredCount}</span>
            <span className="block text-[11px] text-slate-400">Belum Dijawab</span>
          </div>
        </div>

        {(unansweredCount > 0 || flaggedCount > 0) && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200/90 mb-5 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Perhatian: Anda masih memiliki{' '}
              {unansweredCount > 0 && <strong>{unansweredCount} butir belum dijawab</strong>}
              {unansweredCount > 0 && flaggedCount > 0 && ' dan '}
              {flaggedCount > 0 && <strong>{flaggedCount} butir bertanda ragu-ragu</strong>}. Jawaban yang dikumpulkan tidak dapat diubah kembali.
            </span>
          </div>
        )}

        <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700 cursor-pointer select-none mb-6">
          <input
            type="checkbox"
            checked={confirmChecked}
            onChange={(e) => setConfirmChecked(e.target.checked)}
            className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 border-slate-600 bg-slate-900"
          />
          <span className="text-xs text-slate-300">
            Saya yakin dan secara sadar ingin menyelesaikan ujian ini serta mengirimkan semua lembar jawaban.
          </span>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl border border-slate-700 transition-colors"
          >
            Kembali Mengerjakan
          </button>
          <button
            type="button"
            disabled={!confirmChecked}
            onClick={onConfirmFinish}
            className={`flex-1 py-2.5 px-4 font-bold text-xs rounded-xl shadow-lg transition-all ${
              confirmChecked
                ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-rose-600/30'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            Kumpulkan Ujian Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
