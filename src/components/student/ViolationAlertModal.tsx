import React from 'react';
import { ShieldAlert, AlertOctagon, Check } from 'lucide-react';
import { ViolationEvent } from '../../types/cbt';

interface ViolationAlertModalProps {
  isOpen: boolean;
  violation: ViolationEvent | null;
  violationCount: number;
  maxViolations: number;
  onAcknowledge: () => void;
}

export const ViolationAlertModal: React.FC<ViolationAlertModalProps> = ({
  isOpen,
  violation,
  violationCount,
  maxViolations,
  onAcknowledge
}) => {
  if (!isOpen || !violation) return null;

  const isCritical = violationCount >= maxViolations;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-rose-500 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            {isCritical ? <AlertOctagon className="w-7 h-7 text-rose-500 animate-pulse" /> : <ShieldAlert className="w-7 h-7 text-amber-400" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isCritical ? 'Ujian Terkunci: Batas Pelanggaran Terlampaui!' : 'Peringatan Integritas Ujian!'}
            </h3>
            <p className="text-xs text-rose-300 font-mono">
              Pelanggaran ke-{violationCount} dari maksimal {maxViolations} toleransi
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-100 space-y-2 mb-6">
          <p className="font-semibold text-rose-200">
            {violation.message}
          </p>
          <p className="text-slate-300 leading-relaxed">
            Waktu terdeteksi: <strong>{violation.timestamp}</strong>. Sistem mencatat perpindahan fokus layar ke log proktor pengawas.
          </p>
          {isCritical ? (
            <p className="font-bold text-amber-300 pt-1 border-t border-rose-800/40">
              Lembar ujian Anda telah dibekukan. Harap melapor kepada Pengawas Ujian / Proktor untuk membuka kunci verifikasi!
            </p>
          ) : (
            <p className="text-slate-400 text-[11px] pt-1">
              Jika pelanggaran mencapai {maxViolations} kali, sistem akan otomatis mengunci lembar kerja Anda.
            </p>
          )}
        </div>

        <button
          onClick={onAcknowledge}
          className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Saya Paham, Kembali ke Lembar Ujian</span>
        </button>
      </div>
    </div>
  );
};
