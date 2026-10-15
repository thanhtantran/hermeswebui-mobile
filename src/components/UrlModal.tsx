import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Server, Key, Link2, Sparkles } from 'lucide-react';
import { HermesURL } from '../types';

interface UrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<HermesURL, 'id'>, id?: string) => void;
  editingItem: HermesURL | null;
}

export const UrlModal: React.FC<UrlModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
}) => {
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
      setError('Please enter a server name');
      return;
    }

    let trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a server URL');
      return;
    }

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setError('Please enter a valid URL (e.g., https://hermes.orangepi.vn)');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              {editingItem ? 'Edit Hermes Server' : 'Add Hermes Server'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Server Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., OrangePi Production, Local Lab"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Server URL</span>
              {!editingItem && (
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-xs text-blue-600 hover:text-blue-700 font-normal flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Fill test demo
                </button>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://hermes.orangepi.vn"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Include the protocol (https:// or http://).
            </p>
          </div>

          {/* Save Credentials Checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveCredentials}
                onChange={(e) => setSaveCredentials(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <div>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-emerald-600" />
                  Save Password for Auto-Login
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hermes WebUI uses password-only authentication (no username required).
                </p>
              </div>
            </label>
          </div>

          {/* Password Input (conditional) */}
          {saveCredentials && (
            <div className="pl-7 pt-1 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Instance Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Hermes password"
                  className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Credentials are saved securely in your browser's local store.
              </p>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              {editingItem ? 'Save Changes' : 'Add Server'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
