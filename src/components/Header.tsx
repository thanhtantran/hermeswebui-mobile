import React from 'react';
import { Server, Plus, Download, Upload, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  serverCount: number;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  serverCount,
  onOpenAddModal,
  onOpenBackupModal,
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
              <Server className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Hermes Mobile</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
                  {serverCount} {serverCount === 1 ? 'Server' : 'Servers'}
                </span>
              </div>
              <p className="text-blue-100 text-sm mt-0.5">
                Manage and connect to your Hermes WebUI instances
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBackupModal}
              title="Backup / Restore servers"
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100 font-semibold text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer transform active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add URL</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
