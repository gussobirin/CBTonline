import React from 'react';
import { Terminal } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, language }) => {
  const lines = code.trim().split('\n');

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 font-mono text-sm shadow-inner">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-300 uppercase tracking-wider">{language}</span>
        </div>
        <span className="text-[11px] text-slate-500">{lines.length} baris kode</span>
      </div>
      <div className="p-3 overflow-x-auto text-[13px] leading-relaxed select-none">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40">
                <td className="w-10 pr-3 text-right text-slate-500 font-mono select-none text-xs align-top border-r border-slate-800">
                  {idx + 1}
                </td>
                <td className="pl-4 font-mono text-slate-200 whitespace-pre">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
