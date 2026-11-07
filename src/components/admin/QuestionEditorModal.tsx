import React, { useState } from 'react';
import { Question, QuestionType, QuestionOption } from '../../types/cbt';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface QuestionEditorModalProps {
  isOpen: boolean;
  question: Question | null;
  onSave: (savedQuestion: Question) => void;
  onClose: () => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  question,
  onSave,
  onClose
}) => {
  const [type, setType] = useState<QuestionType>(question?.type || 'single_choice');
  const [category, setCategory] = useState<string>(question?.category || 'Pemrograman Web');
  const [questionText, setQuestionText] = useState<string>(question?.questionText || '');
  const [hasCodeSnippet, setHasCodeSnippet] = useState<boolean>(Boolean(question?.codeSnippet));
  const [codeLanguage, setCodeLanguage] = useState<string>(question?.codeSnippet?.language || 'javascript');
  const [codeContent, setCodeContent] = useState<string>(question?.codeSnippet?.code || '');
  const [points, setPoints] = useState<number>(question?.points || 10);
  const [difficulty, setDifficulty] = useState<'Mudah' | 'Sedang' | 'Sukar'>(question?.difficulty || 'Sedang');
  const [explanation, setExplanation] = useState<string>(question?.explanation || '');

  // Options
  const [options, setOptions] = useState<QuestionOption[]>(
    question?.options || [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' }
    ]
  );

  // Correct answer
  const [correctAnswerSingle, setCorrectAnswerSingle] = useState<string>(
    typeof question?.correctAnswer === 'string' ? question.correctAnswer : 'A'
  );
  const [correctAnswerMulti, setCorrectAnswerMulti] = useState<string[]>(
    Array.isArray(question?.correctAnswer) ? question.correctAnswer : ['A']
  );
  const [essayAnswer, setEssayAnswer] = useState<string>(
    typeof question?.correctAnswer === 'string' ? question.correctAnswer : ''
  );

  if (!isOpen) return null;

  const handleAddOption = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const nextLetter = letters[options.length] || `OPT${options.length + 1}`;
    setOptions([...options, { id: nextLetter, text: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, idx) => idx !== index));
  };

  const handleOptionTextChange = (index: number, text: string) => {
    const updated = [...options];
    updated[index].text = text;
    setOptions(updated);
  };

  const handleToggleMultiCorrect = (optId: string) => {
    if (correctAnswerMulti.includes(optId)) {
      if (correctAnswerMulti.length > 1) {
        setCorrectAnswerMulti(correctAnswerMulti.filter(id => id !== optId));
      }
    } else {
      setCorrectAnswerMulti([...correctAnswerMulti, optId].sort());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalCorrectAnswer: string | string[] = correctAnswerSingle;
    if (type === 'multiple_choice') {
      finalCorrectAnswer = correctAnswerMulti;
    } else if (type === 'essay' || type === 'short_answer') {
      finalCorrectAnswer = essayAnswer;
    }

    const savedQuestion: Question = {
      id: question?.id || 'q-' + Date.now(),
      type,
      category: category.trim(),
      questionText: questionText.trim(),
      codeSnippet: hasCodeSnippet
        ? {
            language: codeLanguage,
            code: codeContent.trim()
          }
        : undefined,
      options: type === 'essay' || type === 'short_answer' ? undefined : options,
      correctAnswer: finalCorrectAnswer,
      points: Number(points) || 10,
      explanation: explanation.trim(),
      difficulty
    };

    onSave(savedQuestion);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              {question ? 'Sunting Butir Soal CBT' : 'Tambah Butir Soal Baru'}
            </h3>
            <p className="text-xs text-slate-400">Konfigurasi materi, opsi pilihan, dan kunci jawaban</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Tipe Butir Soal</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as QuestionType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
              >
                <option value="single_choice">Pilihan Ganda (Tunggal)</option>
                <option value="multiple_choice">Pilihan Ganda Kompleks</option>
                <option value="true_false">Benar / Salah (True/False)</option>
                <option value="essay">Uraian / Essay</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Kategori / Kompetensi</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: REST API, SQL, Jaringan"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Bobot Nilai (Poin)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Teks Pertanyaan</label>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Tuliskan butir stimulus dan pertanyaan soal di sini..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-xs leading-relaxed"
              required
            />
          </div>

          {/* Code Snippet Option */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                <input
                  type="checkbox"
                  checked={hasCodeSnippet}
                  onChange={(e) => setHasCodeSnippet(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                />
                <span>Sertakan Cuplikan Kode Program (Code Snippet)</span>
              </label>

              {hasCodeSnippet && (
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px]"
                >
                  <option value="javascript">JavaScript / TypeScript</option>
                  <option value="php">PHP</option>
                  <option value="python">Python</option>
                  <option value="sql">SQL Query</option>
                  <option value="html">HTML / CSS</option>
                  <option value="bash">Bash / Terminal</option>
                </select>
              )}
            </div>

            {hasCodeSnippet && (
              <textarea
                rows={4}
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                placeholder="Paste kode sumber di sini..."
                className="w-full bg-slate-900 font-mono text-[11px] p-2.5 rounded-lg border border-slate-800 text-slate-200"
              />
            )}
          </div>

          {/* Options & Correct Answer setup */}
          {(type === 'single_choice' || type === 'true_false') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">
                  Pilihan Jawaban & Kunci Benar (Pilih satu radio button yang benar)
                </label>
                {type === 'single_choice' && options.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Opsi ({String.fromCharCode(65 + options.length)})</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_answer_single"
                      checked={correctAnswerSingle === opt.id}
                      onChange={() => setCorrectAnswerSingle(opt.id)}
                      className="text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />
                    <span className="w-6 font-mono font-bold text-slate-400 text-center">{opt.id}</span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      placeholder={`Pilihan ${opt.id}`}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                      required
                    />
                    {type === 'single_choice' && options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multiple choice (kompleks) */}
          {type === 'multiple_choice' && (
            <div className="space-y-2">
              <label className="font-semibold text-slate-300">
                Pilihan Jawaban (Centang kotak di kiri untuk menentukan jawaban yang benar)
              </label>
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={correctAnswerMulti.includes(opt.id)}
                      onChange={() => handleToggleMultiCorrect(opt.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />
                    <span className="w-6 font-mono font-bold text-slate-400 text-center">{opt.id}</span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      placeholder={`Pilihan ${opt.id}`}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Essay Answer */}
          {type === 'essay' && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Kunci Jawaban / Rubrik Penilaian Guru
              </label>
              <textarea
                rows={3}
                value={essayAnswer}
                onChange={(e) => setEssayAnswer(e.target.value)}
                placeholder="Poin-poin penting yang wajib ada dalam jawaban siswa..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
          )}

          {/* Pedagogical Explanation */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Pembahasan Lengkap (Ditampilkan saat siswa melihat hasil pembahasan)
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Uraian teori, langkah komputasi, atau alasan jawaban benar..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Butir Soal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
