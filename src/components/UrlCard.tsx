import React, { useState } from 'react';
import {
  Key,
  Pencil,
  Trash2,
  ExternalLink,
  RotateCw,
  Server,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
} from 'lucide-react';
import { HermesURL, PingResult, Language } from '../types';
import { translations } from '../utils/i18n';

interface UrlCardProps {
  item: HermesURL;
  pingResult?: PingResult;
  onConnect: (item: HermesURL) => void;
  onEdit: (item: HermesURL) => void;
  onDelete: (id: string) => void;
  onPingSingle: (item: HermesURL) => void;
  currentLang: Language;
}

export const UrlCard: React.FC<UrlCardProps> = ({
  item,
  pingResult,
  onConnect,
  onEdit,
  onDelete,
  onPingSingle,
  currentLang,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const t = translations[currentLang];

  const status = pingResult?.status || 'idle';
  const latency = pingResult?.latencyMs;

  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-all duration-150 group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left info column */}
        <div className="flex-1 min-w-0">
          {/* Header row: Status Badge + Ping Refresh */}
          <div className="flex items-center gap-2 mb-2">
            {status === 'online' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
                <span>{t.online}</span>
                {latency !== undefined && (
                  <span className="text-emerald-500 font-normal tabular-nums">
                    · {latency}ms
                  </span>
                )}
              </span>
            )}

            {status === 'offline' && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-rose-950/70 text-rose-400 border border-rose-500/30"
                title={pingResult?.error || 'Unreachable'}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500/50" />
                <span>{t.offline}</span>
                {pingResult?.error && (
                  <span className="text-rose-500/90 font-normal text-[10px] hidden md:inline truncate max-w-[150px]">
                    · {pingResult.error}
                  </span>
                )}
              </span>
            )}

            {status === 'checking' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-500/30">
                <RotateCw className="w-2.5 h-2.5 animate-spin" />
                <span>{t.checking}</span>
              </span>
            )}

            {status === 'idle' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono text-slate-400 bg-slate-950 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
                <span>{t.pending}</span>
              </span>
            )}

            {/* Quick Ping Button */}
            <button
              onClick={() => onPingSingle(item)}
              disabled={status === 'checking'}
              className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Ping this endpoint now"
            >
              <RotateCw className={`w-3 h-3 ${status === 'checking' ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>

          {/* Server Name */}
          <div className="flex items-center gap-2">
            <h3 className="text-base font-mono font-bold text-slate-100 truncate tracking-tight">
              {item.name}
            </h3>
          </div>

          {/* URL text */}
          <div className="mt-1 flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="truncate max-w-sm sm:max-w-md text-slate-300 selection:bg-slate-700">
              {item.url}
            </span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-cyan-400 transition-colors"
              title="Open directly in external tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Credentials and metadata indicators */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {item.saveCredentials ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                <Key className="w-3 h-3 text-cyan-400" />
                <span>{t.credentialsSaved}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                <span>{t.noCredentials}</span>
              </span>
            )}
            {item.notes && (
              <span className="text-[11px] font-mono text-slate-500 truncate max-w-xs">
                # {item.notes}
              </span>
            )}
          </div>
        </div>

        {/* Right actions column */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5 bg-rose-950/70 border border-rose-500/40 p-1 rounded-lg">
              <span className="text-[11px] font-mono text-rose-300 px-1">{t.deleteConfirm}</span>
              <button
                onClick={() => onDelete(item.id)}
                className="px-2 py-1 text-[11px] font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white rounded cursor-pointer"
              >
                {t.confirmYes}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-900 rounded cursor-pointer"
              >
                {t.confirmCancel}
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onEdit(item)}
                title={t.edit}
                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-700"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                title={t.delete}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-700"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={() => onConnect(item)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-mono font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer transform active:scale-98"
          >
            <span>{t.connect}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
