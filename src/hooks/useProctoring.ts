import { useEffect, useRef } from 'react';
import { ViolationEvent } from '../types/cbt';

interface ProctoringOptions {
  active: boolean;
  maxViolations: number;
  onViolation: (violation: ViolationEvent) => void;
  onMaxViolationsExceeded: () => void;
}

export const useProctoring = ({
  active,
  maxViolations,
  onViolation,
  onMaxViolationsExceeded
}: ProctoringOptions) => {
  const violationCountRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        violationCountRef.current += 1;
        const event: ViolationEvent = {
          id: 'v-' + Date.now(),
          timestamp: new Date().toLocaleTimeString('id-ID'),
          type: 'tab_switch',
          message: `Terdeteksi berpindah tab atau meminimalkan browser (Pelanggaran ke-${violationCountRef.current})`
        };

        onViolation(event);

        if (violationCountRef.current >= maxViolations) {
          onMaxViolationsExceeded();
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent devtools shortcuts: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U'))
      ) {
        e.preventDefault();
        const event: ViolationEvent = {
          id: 'v-' + Date.now(),
          timestamp: new Date().toLocaleTimeString('id-ID'),
          type: 'devtools_opened',
          message: 'Percobaan membuka shortcut Developer Tools / Sumber Kode'
        };
        onViolation(event);
      }
    };

    const handleCopyCut = (e: ClipboardEvent) => {
      e.preventDefault();
      const event: ViolationEvent = {
        id: 'v-' + Date.now(),
        timestamp: new Date().toLocaleTimeString('id-ID'),
        type: 'copy_attempt',
        message: 'Percobaan menyalin (copy) teks lembar ujian'
      };
      onViolation(event);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopyCut);
    document.addEventListener('cut', handleCopyCut);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopyCut);
      document.removeEventListener('cut', handleCopyCut);
    };
  }, [active, maxViolations, onViolation, onMaxViolationsExceeded]);

  const resetViolations = () => {
    violationCountRef.current = 0;
  };

  return { resetViolations };
};
