import React, { useState } from 'react';
import { SchoolSettings } from '../../types/cbt';
import { Building2, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

interface SettingsViewProps {
  settings: SchoolSettings;
  onSaveSettings: (settings: SchoolSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings
}) => {
  const [form, setForm] = useState<SchoolSettings>(settings);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {isSaved && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Pengaturan institusi dan proktor CBT berhasil disimpan!</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Identitas Sekolah & Konfigurasi CBT</h2>
            <p className="text-xs text-slate-400">Pengaturan kop lembar ujian resmi dan informasi penanggung jawab</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Nama Sekolah / Institusi Pendidikan
            </label>
            <input
              type="text"
              value={form.schoolName}
              onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Judul Header Ujian Resmi (Dicetak pada Kop Hasil)
            </label>
            <input
              type="text"
              value={form.examHeaderTitle}
              onChange={(e) => setForm({ ...form, examHeaderTitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Tahun Ajaran & Semester
              </label>
              <input
                type="text"
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Kurikulum Operasional
              </label>
              <input
                type="text"
                value={form.curriculum}
                onChange={(e) => setForm({ ...form, curriculum: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Nama Kepala Sekolah (Beserta Gelar)
              </label>
              <input
                type="text"
                value={form.principalName}
                onChange={(e) => setForm({ ...form, principalName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Nama Koordinator / Proktor Utama
              </label>
              <input
                type="text"
                value={form.chiefProctorName}
                onChange={(e) => setForm({ ...form, chiefProctorName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Perubahan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
