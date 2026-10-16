import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Server, Key, Link2, Sparkles, Terminal } from 'lucide-react';
import { HermesURL, Language } from '../types';
import { translations } from '../utils/i18n';

interface UrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<HermesURL, 'id'>, id?: string) => void;
  editingItem: HermesURL | null;
  currentLang: Language;
}

export const UrlModal: React.FC<UrlModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');
  const [saveCredentials, setSaveCredentials] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setUrl(editingItem.url);
      setPassword(editingItem.password || '');
      setSaveCredentials(editingItem.saveCredentials);
    } else {
      setName('');
      setUrl('');
      setPassword('');
      setSaveCredentials(false);
    }
    setError(null);
    setShowPassword(false);
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(currentLang === 'vi' ? 'Vui lòng nhập tên định danh máy chủ' : 'Please specify a server name');
      return;
    }

    let trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError(currentLang === 'vi' ? 'Vui lòng nhập URL máy chủ' : 'Please specify an endpoint URL');
      return;
    }

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setError(currentLang === 'vi' ? 'Định dạng URL không hợp lệ (ví dụ: https://hermes.orangepi.vn)' : 'Invalid URL syntax (e.g. https://hermes.orangepi.vn)');
      return;
    }

    onSave(
      {
        name: name.trim(),
        url: trimmedUrl,
        password: saveCredentials ? password : '',
        saveCredentials,
      },
      editingItem?.id
    );
  };

  const fillDemoCredentials = () => {
    setName('OrangePi Hermes Demo');
    setUrl('https://hermes.orangepi.vn');
    setPassword('orangepi');
    setSaveCredentials(true);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 max-w-lg w-full overflow-hidden text-slate-100 font-mono">
        {/* Modal Header */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-100 tracking-wider">
              {editingItem ? t.modalEditTitle : t.modalAddTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {t.serverNameLabel}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.serverNamePlaceholder}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 text-xs focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {t.serverUrlLabel}
              </label>
              {!editingItem && (
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  {t.fillDemoBtn}
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600">
                <Link2 className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t.serverUrlPlaceholder}
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 text-xs focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {t.urlNote}
            </p>
          </div>

          {/* Save Credentials Checkbox */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveCredentials}
                onChange={(e) => setSaveCredentials(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 border-slate-700 bg-slate-950 cursor-pointer"
              />
              <div>
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  {t.saveCredsLabel}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t.saveCredsDesc}
                </p>
              </div>
            </label>
          </div>

          {/* Password Input (conditional) */}
          {saveCredentials && (
            <div className="pl-6 pt-1 space-y-1">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full px-3 py-2 pr-9 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 text-xs focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              {t.btnCancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 text-xs font-mono font-bold shadow-sm transition-colors cursor-pointer"
            >
              {editingItem ? t.btnSave : t.btnAdd}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
