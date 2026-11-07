import React, { useState, useEffect, useCallback } from 'react';
import { ExamPackage, StudentProfile, ViolationEvent, ExamSessionState } from '../../types/cbt';
import { QuestionPalette } from './QuestionPalette';
import { ExamSummaryModal } from './ExamSummaryModal';
import { ViolationAlertModal } from './ViolationAlertModal';
import { CodeViewer } from '../common/CodeViewer';
import { useFullscreen } from '../../hooks/useFullscreen';
import { useProctoring } from '../../hooks/useProctoring';
import {
  Clock,
  Maximize2,
  Minimize2,
  LayoutGrid,
  ShieldAlert,
  Save,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Video,
  Camera
} from 'lucide-react';

interface ExamRunnerProps {
  exam: ExamPackage;
  student: StudentProfile;
  initialSession?: ExamSessionState | null;
  onFinishExam: (completedSession: ExamSessionState) => void;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({
  exam,
  student,
  initialSession,
  onFinishExam
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(
    initialSession?.answers || {}
  );
  const [flagged, setFlagged] = useState<Record<string, boolean>>(
    initialSession?.flaggedQuestions || {}
  );
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    initialSession?.remainingSeconds ?? exam.durationMinutes * 60
  );
  const [violations, setViolations] = useState<ViolationEvent[]>(
    initialSession?.violations || []
  );
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
  const [currentViolation, setCurrentViolation] = useState<ViolationEvent | null>(null);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(initialSession?.isLocked || false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showWebcamPreview, setShowWebcamPreview] = useState<boolean>(true);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Baru saja');

  const { isFullscreen, toggleFullscreen, requestFullscreen } = useFullscreen();

  const questions = exam.questions;
  const currentQuestion = questions[currentIndex];

  // Request fullscreen on start if exam has strict fullscreen setting
  useEffect(() => {
    if (exam.strictFullscreen && !isFullscreen) {
      requestFullscreen();
    }
  }, [exam.strictFullscreen, isFullscreen, requestFullscreen]);

  // Anti-cheat hook
  const handleViolation = useCallback((violation: ViolationEvent) => {
    setViolations(prev => {
      const updated = [violation, ...prev];
      return updated;
    });
    setCurrentViolation(violation);
    setIsViolationModalOpen(true);
  }, []);

  const handleMaxViolationsExceeded = useCallback(() => {
    setIsLocked(true);
  }, []);

  useProctoring({
    active: !isLocked,
    maxViolations: exam.maxViolations,
    onViolation: handleViolation,
    onMaxViolationsExceeded: handleMaxViolationsExceeded
  });

  // Countdown Timer
  useEffect(() => {
    if (isLocked) return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked]);

  // Keyboard shortcut listener (A, B, C, D, E for options; N for Next; P for Prev; R for Ragu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside textarea
      if ((e.target as HTMLElement)?.tagName === 'TEXTAREA' || (e.target as HTMLElement)?.tagName === 'INPUT') {
        return;
      }

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D', 'E'].includes(key) && currentQuestion?.options) {
        const optionExists = currentQuestion.options.some(opt => opt.id === key);
        if (optionExists) {
          if (currentQuestion.type === 'single_choice' || currentQuestion.type === 'true_false') {
            handleSingleChoiceSelect(currentQuestion.id, key);
          } else if (currentQuestion.type === 'multiple_choice') {
            handleMultipleChoiceToggle(currentQuestion.id, key);
          }
        }
      } else if (key === 'N' || e.key === 'ArrowRight') {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      } else if (key === 'P' || e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
      } else if (key === 'R') {
        handleToggleFlag(currentQuestion.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQuestion, questions.length]);

  const handleSingleChoiceSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    setLastSavedTime(new Date().toLocaleTimeString('id-ID'));
  };

  const handleMultipleChoiceToggle = (questionId: string, optionId: string) => {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) || [];
      const exists = current.includes(optionId);
      const updated = exists ? current.filter(id => id !== optionId) : [...current, optionId].sort();
      return {
        ...prev,
        [questionId]: updated
      };
    });
    setLastSavedTime(new Date().toLocaleTimeString('id-ID'));
  };

  const handleTextAnswerChange = (questionId: string, val: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: val
    }));
    setLastSavedTime(new Date().toLocaleTimeString('id-ID'));
  };

  const handleToggleFlag = (questionId: string) => {
    setFlagged(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const calculateGrading = () => {
    let totalPointsEarned = 0;
    let maxPointsPossible = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    questions.forEach(q => {
      maxPointsPossible += q.points;
      const studentAns = answers[q.id];

      if (!studentAns || (Array.isArray(studentAns) && studentAns.length === 0) || (typeof studentAns === 'string' && studentAns.trim() === '')) {
        unansweredCount += 1;
        return;
      }

      if (q.type === 'single_choice' || q.type === 'true_false') {
        if (studentAns === q.correctAnswer) {
          totalPointsEarned += q.points;
          correctCount += 1;
        } else {
          wrongCount += 1;
        }
      } else if (q.type === 'multiple_choice') {
        const correctArray = Array.isArray(q.correctAnswer) ? [...q.correctAnswer].sort() : [q.correctAnswer];
        const studentArray = Array.isArray(studentAns) ? [...studentAns].sort() : [studentAns];

        if (JSON.stringify(correctArray) === JSON.stringify(studentArray)) {
          totalPointsEarned += q.points;
          correctCount += 1;
        } else {
          wrongCount += 1;
        }
      } else {
        // Essay / short answer mock auto check
        if (typeof studentAns === 'string' && studentAns.length >= 10) {
          totalPointsEarned += q.points;
          correctCount += 1;
        } else {
          wrongCount += 1;
        }
      }
    });

    const finalPercentage = maxPointsPossible > 0 ? Math.round((totalPointsEarned / maxPointsPossible) * 100) : 0;
    const passed = finalPercentage >= exam.passingGrade;

    return {
      totalPointsEarned,
      maxPointsPossible,
      finalPercentage,
      passed,
      correctCount,
      wrongCount,
      unansweredCount
    };
  };

  const handleFinalSubmit = () => {
    const grading = calculateGrading();
    const completedSession: ExamSessionState = {
      examId: exam.id,
      student,
      startedAt: initialSession?.startedAt || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      durationMinutes: exam.durationMinutes,
      remainingSeconds,
      answers,
      flaggedQuestions: flagged,
      isSubmitted: true,
      isLocked: false,
      violations,
      calculatedScore: grading
    };

    onFinishExam(completedSession);
  };

  const handleAutoSubmit = () => {
    handleFinalSubmit();
  };

  // Format remaining time HH:MM:SS
  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = remainingSeconds < 300; // < 5 mins
  const isMediumTime = remainingSeconds < 600; // < 10 mins

  // Font size scaler class
  const getFontSizeClass = () => {
    if (fontSizeLevel === 'large') return 'text-lg';
    if (fontSizeLevel === 'xlarge') return 'text-xl';
    return 'text-base';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Top CBT Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Identity & Exam Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
              CBT
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white truncate leading-tight">
                {exam.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-indigo-300 font-semibold">{student.studentId}</span>
                <span>·</span>
                <span className="truncate">{student.fullName}</span>
                <span>·</span>
                <span className="hidden sm:inline text-slate-500">{student.classGroup}</span>
              </div>
            </div>
          </div>

          {/* Zone 2: Timer, Tools & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Countdown Timer */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm tracking-wider transition-colors ${
                isLowTime
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                  : isMediumTime
                  ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-emerald-400'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(remainingSeconds)}</span>
            </div>

            {/* Font Scaler */}
            <div className="hidden md:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setFontSizeLevel('normal')}
                className={`px-2 py-1 rounded font-medium ${fontSizeLevel === 'normal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Ukuran Font Normal"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeLevel('large')}
                className={`px-2 py-1 rounded font-medium ${fontSizeLevel === 'large' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Ukuran Font Besar"
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeLevel('xlarge')}
                className={`px-2 py-1 rounded font-medium ${fontSizeLevel === 'xlarge' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Ukuran Font Sangat Besar"
              >
                A++
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Wajib)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Question Palette Toggle */}
            <button
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Daftar Soal</span>
              <span className="font-mono bg-indigo-600 text-white px-1.5 py-0.2 rounded text-[11px]">
                {currentIndex + 1}/{questions.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Column: Question Paper */}
        <main className={`flex flex-col justify-between ${isPaletteOpen ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'}`}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-between">
            {/* Question Meta Header */}
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-md bg-indigo-600 text-white font-mono font-bold text-xs tracking-wider">
                    SOAL NO. {currentIndex + 1}
                  </span>
                  <span className="text-xs text-slate-400">
                    Kategori: <strong className="text-slate-300">{currentQuestion.category}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">
                    Bobot: <strong className="text-indigo-400">{currentQuestion.points} Poin</strong>
                  </span>
                  {currentQuestion.difficulty && (
                    <span className="text-slate-400">
                      Tingkat: <strong className="text-slate-300">{currentQuestion.difficulty}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className={`text-slate-100 leading-relaxed font-normal ${getFontSizeClass()}`}>
                {currentQuestion.questionText}
              </div>

              {/* Code Snippet Box (if any) */}
              {currentQuestion.codeSnippet && (
                <CodeViewer
                  code={currentQuestion.codeSnippet.code}
                  language={currentQuestion.codeSnippet.language}
                />
              )}

              {/* Answer Options Zone */}
              <div className="mt-6 space-y-3">
                {/* Single Choice / True False */}
                {(currentQuestion.type === 'single_choice' || currentQuestion.type === 'true_false') &&
                  currentQuestion.options?.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSingleChoiceSelect(currentQuestion.id, opt.id)}
                        className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500'
                            : 'bg-slate-800/50 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-700/80 text-slate-300 border border-slate-600'
                          }`}
                        >
                          {opt.id}
                        </div>
                        <div className={`text-sm pt-0.5 leading-relaxed ${getFontSizeClass()}`}>
                          {opt.text}
                        </div>
                      </div>
                    );
                  })}

                {/* Multiple Choice (Kompleks) */}
                {currentQuestion.type === 'multiple_choice' &&
                  currentQuestion.options?.map((opt) => {
                    const currentSelected = (answers[currentQuestion.id] as string[]) || [];
                    const isChecked = currentSelected.includes(opt.id);

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleMultipleChoiceToggle(currentQuestion.id, opt.id)}
                        className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500'
                            : 'bg-slate-800/50 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'bg-slate-700/80 text-slate-300 border-slate-600'
                          }`}
                        >
                          {isChecked ? '✓' : opt.id}
                        </div>
                        <div className={`text-sm pt-0.5 leading-relaxed ${getFontSizeClass()}`}>
                          {opt.text}
                        </div>
                      </div>
                    );
                  })}

                {/* Essay or Short Answer */}
                {currentQuestion.type === 'essay' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">
                      Ketik jawaban uraian / penjelasan Anda secara lengkap:
                    </label>
                    <textarea
                      rows={6}
                      value={(answers[currentQuestion.id] as string) || ''}
                      onChange={(e) => handleTextAnswerChange(currentQuestion.id, e.target.value)}
                      placeholder="Tuliskan analisis, langkah-langkah, dan solusi Anda..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                      <span>Mendukung penjelasan teknis dan uraian analisis</span>
                      <span>
                        {((answers[currentQuestion.id] as string) || '').trim().split(/\s+/).filter(Boolean).length} Kata
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Autosave Status Indicator */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Jawaban tersimpan otomatis</span>
                <span className="text-slate-500 text-[11px]">({lastSavedTime})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <span>Pintas tombol:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono">A-E</kbd>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono">P/N</kbd>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono">R</kbd>
              </div>
            </div>
          </div>

          {/* Navigation Action Strip */}
          <div className="flex items-center justify-between gap-4 mt-4 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow-lg">
            {/* Previous Question Button */}
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                currentIndex === 0
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {/* Flag / Ragu-ragu Checkbox */}
            <button
              onClick={() => handleToggleFlag(currentQuestion.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                flagged[currentQuestion.id]
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{flagged[currentQuestion.id] ? 'Tandai Ragu-Ragu (Aktif)' : 'Ragu-Ragu'}</span>
            </button>

            {/* Next or Finish Button */}
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsSummaryModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Selesaikan Ujian</span>
              </button>
            )}
          </div>
        </main>

        {/* Right Column: Question Palette Drawer & Proctor Cam Preview */}
        {isPaletteOpen && (
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
            <QuestionPalette
              questions={questions}
              currentIndex={currentIndex}
              answers={answers}
              flagged={flagged}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
              onClose={() => setIsPaletteOpen(false)}
              onFinishExamClick={() => setIsSummaryModalOpen(true)}
            />

            {/* Simulated Live Proctoring Camera Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <Camera className="w-3.5 h-3.5" />
                  <span>Pengawasan Kamera Proktor Aktif</span>
                </div>
                <button
                  onClick={() => setShowWebcamPreview(!showWebcamPreview)}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  {showWebcamPreview ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>

              {showWebcamPreview && (
                <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                  <div className="text-center p-3">
                    <Video className="w-6 h-6 text-indigo-400 mx-auto mb-1 opacity-70" />
                    <p className="text-[11px] text-slate-400">Stream Kehadiran Peserta Terhubung</p>
                    <p className="text-[10px] text-slate-500 font-mono">Ruang: {student.roomNumber || 'LAB-01'}</p>
                  </div>
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> REC 30 FPS
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Confirmation & Alert Modals */}
      <ExamSummaryModal
        isOpen={isSummaryModalOpen}
        questions={questions}
        answers={answers}
        flagged={flagged}
        onClose={() => setIsSummaryModalOpen(false)}
        onConfirmFinish={handleFinalSubmit}
      />

      <ViolationAlertModal
        isOpen={isViolationModalOpen}
        violation={currentViolation}
        violationCount={violations.length}
        maxViolations={exam.maxViolations}
        onAcknowledge={() => {
          setIsViolationModalOpen(false);
          requestFullscreen();
        }}
      />
    </div>
  );
};
