import React from 'react';
import { Terminal, Plus, Download, Globe } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface HeaderProps {
  serverCount: number;
  currentLang: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  serverCount,
  currentLang,
  onToggleLanguage,
  onOpenAddModal,
  onOpenBackupModal,
}) => {
  const t = translations[currentLang];

  return (
    <header className="bg-slate-950 border-b border-slate-800/80 text-slate-100 sticky top-0 z-30 backdrop-blur-md bg-slate-950/90">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 shadow-inner">
              <Terminal className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wider text-slate-100 font-mono">
                  HERMES<span className="text-cyan-400">.UI</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 tabular-nums">
                  {serverCount} {serverCount === 1 ? t.serversSingular : t.serverCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-mono">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Zone 2 & 3: Language Toggle, Backup & Add Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher [ EN | VI ] */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => onToggleLanguage('en')}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => onToggleLanguage('vi')}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-all cursor-pointer ${
                  currentLang === 'vi'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Chuyển sang Tiếng Việt"
              >
                VI
              </button>
            </div>

            {/* Backup Button */}
            <button
              onClick={onOpenBackupModal}
              title={t.backup}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.backup}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer transform active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{t.addServer}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
