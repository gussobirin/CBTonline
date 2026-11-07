import React from 'react';
import { Question } from '../../types/cbt';
import { CheckCircle2, HelpCircle, CircleDot, X } from 'lucide-react';

interface QuestionPaletteProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string | string[]>;
  flagged: Record<string, boolean>;
  onSelectQuestion: (index: number) => void;
  onClose?: () => void;
  onFinishExamClick: () => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentIndex,
  answers,
  flagged,
  onSelectQuestion,
  onClose,
  onFinishExamClick
}) => {
  const answeredCount = questions.filter(q => {
    const ans = answers[q.id];
    if (Array.isArray(ans)) return ans.length > 0;
    return typeof ans === 'string' && ans.trim().length > 0;
  }).length;

  const flaggedCount = questions.filter(q => flagged[q.id]).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide">Daftar Nomor Soal</h4>
          <p className="text-[11px] text-slate-400">Navigasi butir soal ujian</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            title="Tutup Navigasi"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status Legends */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5 p-1.5 bg-emerald-950/40 border border-emerald-800/40 rounded-lg">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Dijawab: <strong className="text-white font-mono">{answeredCount}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 p-1.5 bg-amber-950/40 border border-amber-800/40 rounded-lg">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Ragu: <strong className="text-white font-mono">{flaggedCount}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg">
          <CircleDot className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Belum: <strong className="text-white font-mono">{unansweredCount}</strong></span>
        </div>
      </div>

      {/* Grid of Question Numbers */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const hasAnswer = Boolean(
              Array.isArray(answers[q.id])
                ? (answers[q.id] as string[]).length > 0
                : typeof answers[q.id] === 'string' && (answers[q.id] as string).trim().length > 0
            );
            const isFlagged = Boolean(flagged[q.id]);
            const isActive = idx === currentIndex;

            let bgStyle = 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700';
            if (isFlagged) {
              bgStyle = 'bg-amber-600 border-amber-500 text-white font-bold hover:bg-amber-500 shadow-sm';
            } else if (hasAnswer) {
              bgStyle = 'bg-emerald-600 border-emerald-500 text-white font-bold hover:bg-emerald-500 shadow-sm';
            }

            return (
              <button
                key={q.id}
                onClick={() => onSelectQuestion(idx)}
                className={`h-11 rounded-lg border text-xs flex flex-col items-center justify-center relative transition-all ${bgStyle} ${
                  isActive ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900 scale-105 z-10' : ''
                }`}
                title={`Soal nomor ${idx + 1}`}
              >
                <span className="font-mono text-sm">{idx + 1}</span>
                {hasAnswer && !isFlagged && (
                  <span className="text-[9px] uppercase font-mono opacity-80 leading-none">
                    {Array.isArray(answers[q.id])
                      ? (answers[q.id] as string[]).join('')
                      : (answers[q.id] as string).length > 2
                      ? '✓'
                      : answers[q.id]}
                  </span>
                )}
                {isFlagged && (
                  <span className="text-[9px] uppercase font-mono text-amber-100 leading-none">
                    Ragu
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Finish Exam Button */}
      <div className="pt-4 mt-3 border-t border-slate-800">
        <button
          onClick={onFinishExamClick}
          className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <span>Selesaikan Ujian</span>
        </button>
      </div>
    </div>
  );
};
